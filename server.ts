/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { DBManager, DIRECTORY_DEPARTMENTS } from "./src/db/dbManager";
import { GoogleGenAI, Type } from "@google/genai";
import { Question, ScenarioQuestion, ExamAttempt } from "./src/types";

// Initialize database
DBManager.init();

const app = express();
const PORT = 3000;

app.use(express.json());

// --- LAZY INITIALIZATION OF GEMINI SDK ---
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY" || key.trim() === "") {
      throw new Error("Vui lòng cấu hình hòm thư bí mật GEMINI_API_KEY trong góc Cài đặt (Settings > Secrets) để kích hoạt Trí tuệ nhân tạo AI sinh đề!");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// --- AUTH MIDDLEWARE (SIMPLE SESSION TOKEN) ---
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ error: "Yêu cầu đăng nhập để tiếp tục." });
    return;
  }
  
  const userId = token.replace("Bearer ", "");
  const user = DBManager.getUserById(userId);
  if (!user) {
    res.status(401).json({ error: "Phiên đăng nhập không tồn tại hoặc đã hết hạn." });
    return;
  }
  
  (req as any).user = user;
  next();
};

// --- AUTHENTICATION ENDPOINTS ---

app.get("/api/departments", (req, res) => {
  res.json(DIRECTORY_DEPARTMENTS);
});

app.post("/api/auth/check-gmail", (req, res) => {
  const { email } = req.body;
  if (!email || (!email.includes("@gmail.com") && email.toLowerCase() !== "pvantho@pdu.edu.vn")) {
    res.status(400).json({ error: "Hòm thư Gmail không hợp lệ. Vui lòng nhập địa chỉ @gmail.com hoặc hòm thư pvantho@pdu.edu.vn." });
    return;
  }
  const user = DBManager.getUserByUsername(email);
  res.json({ exists: !!user });
});

app.post("/api/auth/gmail-login-direct", (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: "Thiếu thông tin hòm thư Gmail." });
    return;
  }
  const user = DBManager.getUserByUsername(email);
  if (!user) {
    res.status(404).json({ error: "Tài khoản Gmail này chưa được kích hoạt liên kết." });
    return;
  }
  
  DBManager.logAction(
    user.id,
    user.username,
    user.fullName,
    "Đăng nhập Gmail",
    `Cán bộ đăng nhập thành công bằng hòm thư Gmail liên kết: ${email}`,
    req.ip || "127.0.0.1",
    req.headers["user-agent"] || "unknown"
  );
  res.json({ user, token: user.id });
});

app.post("/api/auth/gmail-register", (req, res) => {
  const { email, fullName, department } = req.body;
  if (!email || !fullName || !department) {
    res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin cá nhân bắt buộc." });
    return;
  }
  try {
    const newUser = DBManager.registerGmailUser(email, fullName, department);
    DBManager.logAction(
      newUser.id,
      newUser.username,
      newUser.fullName,
      "Liên kết Gmail",
      `Đăng ký & liên kết tài khoản Gmail đầu tiên thành công tại đơn vị: ${newUser.department}`,
      req.ip || "127.0.0.1",
      req.headers["user-agent"] || "unknown"
    );
    res.json({ user: newUser, token: newUser.id });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Đăng ký liên kết Gmail thất bại." });
  }
});

app.post("/api/auth/register", (req, res) => {
  const { username, fullName, department, password } = req.body;
  if (!username || !fullName || !department || !password) {
    res.status(400).json({ error: "Vui lòng nhập đầy đủ tất cả các trường dữ liệu bắt buộc." });
    return;
  }
  try {
    const newUser = DBManager.registerUser(username, fullName, department, password);
    DBManager.logAction(
      newUser.id,
      newUser.username,
      newUser.fullName,
      "Đăng ký tài khoản",
      `Đăng ký tài khoản mới thành công tại đơn vị: ${newUser.department}`,
      req.ip || "127.0.0.1",
      req.headers["user-agent"] || "unknown"
    );
    res.json({ user: newUser, token: newUser.id });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Đăng ký không thành công" });
  }
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Vui lòng điền tên đăng nhập và mật khẩu." });
    return;
  }
  const user = DBManager.authenticateUser(username, password);
  if (!user) {
    res.status(401).json({ error: "Tên đăng nhập hoặc mật khẩu không chính xác." });
    return;
  }
  DBManager.logAction(
    user.id,
    user.username,
    user.fullName,
    "Đăng nhập",
    "Đăng nhập hệ thống thi thành công",
    req.ip || "127.0.0.1",
    req.headers["user-agent"] || "unknown"
  );
  res.json({ user, token: user.id });
});

app.get("/api/auth/me", authenticate, (req: any, res) => {
  res.json(req.user);
});

app.post("/api/auth/update-department", authenticate, (req: any, res) => {
  const { department } = req.body;
  if (!department) {
    res.status(400).json({ error: "Vui lòng chọn xã/phường công tác." });
    return;
  }
  const success = DBManager.updateUserDepartment(req.user.id, department);
  if (success) {
    DBManager.logAction(
      req.user.id,
      req.user.username,
      req.user.fullName,
      "Thay đổi xã/phường",
      `Thay đổi xã/phường công tác thành công: ${department}`,
      req.ip || "127.0.0.1",
      req.headers["user-agent"] || "unknown"
    );
    // Refresh user object in memory for active thread session
    req.user.department = department;
    res.json({ success: true, message: "Cập nhật đơn vị xã/phường công tác thành công." });
  } else {
    res.status(404).json({ error: "Không tìm thấy thông tin cán bộ." });
  }
});

// --- EXAM / ATTEMPT ENDPOINTS ---

// 1. Start Exam
app.post("/api/exam/start", authenticate, (req: any, res) => {
  const user = req.user;
  const oldAttempts = DBManager.getAttemptsByUser(user.id).filter(a => a.completedAt);
  
  if (oldAttempts.length >= 5) {
    res.status(400).json({ error: "Bạn đã hoàn thành đủ số lượt thi tối đa (5 lần). Không thể bắt đầu thi lượt mới!" });
    return;
  }

  // Generate unique exam sheet (Questions shuffler & Category distribution with restricted overlap)
  const examSheet = DBManager.generateExamPaper(user.id);

  // Strip answers before sending to client to prevent client-side inspection! High cryptography.
  const clientQuestions = examSheet.questions.map(q => ({
    id: q.id,
    category: q.category,
    questionText: q.questionText,
    choices: q.choices,
    difficulty: q.difficulty
  }));

  const clientScenarios = examSheet.scenarios.map(s => ({
    id: s.id,
    topic: s.topic,
    scenarioText: s.scenarioText,
    step1: { prompt: s.step1.prompt, choices: s.step1.choices },
    step2: { prompt: s.step2.prompt, choices: s.step2.choices },
    step3: { prompt: s.step3.prompt, choices: s.step3.choices }
  }));

  const attemptNumber = oldAttempts.length + 1;
  const newAttempt: ExamAttempt = {
    id: "att_" + Math.random().toString(36).substring(2, 11),
    userId: user.id,
    userFullName: user.fullName,
    userDepartment: user.department,
    attemptNumber,
    startedAt: new Date().toISOString(),
    score: 0,
    timeSpentSeconds: 0,
    browser: req.headers["user-agent"] || "unknown",
    ipAddress: req.ip || "127.0.0.1",
    cheatWarningsCount: 0,
    answers: {
      partA: {},
      partB: {}
    }
  };

  DBManager.saveAttempt(newAttempt);
  DBManager.logAction(
    user.id,
    user.username,
    user.fullName,
    "Bắt đầu thi",
    `Bắt đầu lượt thi thứ ${attemptNumber}/5. Mã đề: ${newAttempt.id}`,
    req.ip || "127.0.0.1",
    req.headers["user-agent"] || "unknown"
  );

  res.json({
    attemptId: newAttempt.id,
    attemptNumber,
    questions: clientQuestions,
    scenarios: clientScenarios,
    startedAt: newAttempt.startedAt
  });
});

// 2. Auto-save status (Every 30 seconds)
app.post("/api/exam/autosave", authenticate, (req: any, res) => {
  const { attemptId, answers, timeSpentSeconds } = req.body;
  if (!attemptId) {
    res.status(400).json({ error: "Thiếu mã lượt thi" });
    return;
  }
  
  const attempts = DBManager.getAttemptsByUser(req.user.id);
  const attempt = attempts.find(a => a.id === attemptId);
  if (!attempt) {
    res.status(404).json({ error: "Không tìm thấy lượt thi này" });
    return;
  }

  if (attempt.completedAt) {
    res.status(400).json({ error: "Bài thi đã được nộp từ trước." });
    return;
  }

  attempt.answers = answers || { partA: {}, partB: {} };
  attempt.timeSpentSeconds = timeSpentSeconds || attempt.timeSpentSeconds;
  DBManager.saveAttempt(attempt);

  res.json({ status: "success", savedAt: new Date().toISOString() });
});

// 3. Log Fraud alerts (Tab switching warning)
app.post("/api/exam/cheat-warning", authenticate, (req: any, res) => {
  const { attemptId, currentWarningsCount, detail } = req.body;
  if (!attemptId) {
    res.status(400).json({ error: "Thiếu mã lượt thi" });
    return;
  }
  const attempts = DBManager.getAttemptsByUser(req.user.id);
  const attempt = attempts.find(a => a.id === attemptId);
  if (attempt && !attempt.completedAt) {
    attempt.cheatWarningsCount = currentWarningsCount;
    DBManager.saveAttempt(attempt);
    DBManager.logAction(
      req.user.id,
      req.user.username,
      req.user.fullName,
      "Cảnh báo gian lận",
      `Chuyển đổi màn hình làm việc (Tab Switch) lần thứ ${currentWarningsCount}. Chi tiết: ${detail}`,
      req.ip || "127.0.0.1",
      req.headers["user-agent"] || "unknown"
    );
  }
  res.json({ status: "logged" });
});

// 4. Submit & Compute Score / Detailed Graded Results
app.post("/api/exam/submit", authenticate, (req: any, res) => {
  const user = req.user;
  const { attemptId, answers, timeSpentSeconds } = req.body;

  if (!attemptId) {
    res.status(400).json({ error: "Thiếu mã lượt thi" });
    return;
  }

  const attempts = DBManager.getAttemptsByUser(user.id);
  const attempt = attempts.find(a => a.id === attemptId);
  if (!attempt) {
    res.status(404).json({ error: "Lượt thi không khả dụng" });
    return;
  }

  if (attempt.completedAt) {
    res.status(400).json({ error: "Bài thi này đã nộp trước đó." });
    return;
  }

  // Update final submitted answers
  attempt.answers = answers || { partA: {}, partB: {} };
  attempt.timeSpentSeconds = timeSpentSeconds || attempt.timeSpentSeconds;
  attempt.completedAt = new Date().toISOString();

  // Load the questions/scenarios from DB to compute score safely on server
  const allQuestions = DBManager.getQuestions();
  const allScenarios = DBManager.getScenarios();

  let finalScore = 0;
  
  // Grade Part A (Multiple choice) - 20 questions, 3 points each (Total 60)
  const gradedPartA = Object.keys(attempt.answers.partA || {}).map(qId => {
    const origQ = allQuestions.find(q => q.id === qId);
    if (!origQ) return null;

    const chosenId = attempt.answers.partA[qId];
    const isCorrect = origQ.correctAnswerId === chosenId;
    const points = isCorrect ? 3 : 0;
    finalScore += points;

    return {
      questionId: qId,
      questionText: origQ.questionText,
      chosenAnswer: origQ.choices.find(c => c.id === chosenId)?.text || "Không trả lời",
      correctAnswer: origQ.choices.find(c => c.id === origQ.correctAnswerId)?.text || "N/A",
      isCorrect,
      points,
      explanation: origQ.explanation
    };
  }).filter((x): x is any => x !== null);

  // Grade Part B (Scenarios) - 5 scenarios, 8 points each (3 + 3 + 2, Total 40)
  const gradedPartB = Object.keys(attempt.answers.partB || {}).map(sId => {
    const origS = allScenarios.find(s => s.id === sId);
    if (!origS) return null;

    const userChoices = attempt.answers.partB[sId] || { step1: "", step2: "", step3: "" };

    const is1Correct = origS.step1.correctAnswerId === userChoices.step1;
    const is2Correct = origS.step2.correctAnswerId === userChoices.step2;
    const is3Correct = origS.step3.correctAnswerId === userChoices.step3;

    const p1 = is1Correct ? 3 : 0;
    const p2 = is2Correct ? 3 : 0;
    const p3 = is3Correct ? 2 : 0;

    const totalScenarioPoints = p1 + p2 + p3;
    finalScore += totalScenarioPoints;

    return {
      scenarioId: sId,
      topic: origS.topic,
      scenarioText: origS.scenarioText,
      step1: {
        prompt: origS.step1.prompt,
        chosen: origS.step1.choices.find(c => c.id === userChoices.step1)?.text || "Không trả lời",
        correct: origS.step1.choices.find(c => c.id === origS.step1.correctAnswerId)?.text || "N/A",
        isCorrect: is1Correct,
        points: p1
      },
      step2: {
        prompt: origS.step2.prompt,
        chosen: origS.step2.choices.find(c => c.id === userChoices.step2)?.text || "Không trả lời",
        correct: origS.step2.choices.find(c => c.id === origS.step2.correctAnswerId)?.text || "N/A",
        isCorrect: is2Correct,
        points: p2
      },
      step3: {
        prompt: origS.step3.prompt,
        chosen: origS.step3.choices.find(c => c.id === userChoices.step3)?.text || "Không trả lời",
        correct: origS.step3.choices.find(c => c.id === origS.step3.correctAnswerId)?.text || "N/A",
        isCorrect: is3Correct,
        points: p3
      },
      explanation: origS.explanation,
      totalPoints: totalScenarioPoints
    };
  }).filter((x): x is any => x !== null);

  attempt.score = finalScore;
  attempt.gradedDetails = {
    partA: gradedPartA,
    partB: gradedPartB
  };

  DBManager.saveAttempt(attempt);

  // Compute grade label
  let rank = "Chưa đạt";
  if (finalScore >= 95) rank = "Xuất sắc";
  else if (finalScore >= 85) rank = "Giỏi";
  else if (finalScore >= 70) rank = "Khá";
  else if (finalScore >= 50) rank = "Đạt";

  DBManager.logAction(
    user.id,
    user.username,
    user.fullName,
    "Nộp bài thi",
    `Nộp bài thi lượt ${attempt.attemptNumber}/5 thành công. Điểm số đạt được: ${finalScore}/100, Xếp loại: ${rank}`,
    req.ip || "127.0.0.1",
    req.headers["user-agent"] || "unknown"
  );

  res.json({
    score: finalScore,
    grade: rank,
    gradedDetails: attempt.gradedDetails
  });
});

// 5. Get attempt histories
app.get("/api/exam/attempts", authenticate, (req: any, res) => {
  const attempts = DBManager.getAttemptsByUser(req.user.id);
  res.json(attempts);
});

// --- ADMIN SYSTEM & STATISTICS ---

function getGradeLabel(score: number): string {
  if (score >= 95) return "Xuất sắc";
  if (score >= 85) return "Giỏi";
  if (score >= 70) return "Khá";
  if (score >= 50) return "Đạt";
  return "Chưa đạt";
}

const isAdminOrSuperOrManager = (u: any) => u && (u.role === 'admin' || u.role === 'superuser' || u.role === 'manager');
const isAdminOrSuper = (u: any) => u && (u.role === 'admin' || u.role === 'superuser');

app.get("/api/admin/dashboard-stats", authenticate, (req: any, res) => {
  // Aggregate individual statistics
  const user = req.user;
  const myAttempts = DBManager.getAttemptsByUser(user.id).filter(a => a.completedAt);
  
  const highestScore = myAttempts.length > 0 ? Math.max(...myAttempts.map(a => a.score)) : 0;
  const remainingAttempts = Math.max(0, 5 - myAttempts.length);

  const individualStats = {
    hasMaxAttempts: myAttempts.length >= 5,
    remainingAttempts,
    highestScoreScore: highestScore,
    highestScoreGrade: myAttempts.length > 0 ? getGradeLabel(highestScore) : "Chưa kiểm tra",
    attempts: myAttempts.map(a => ({
      attemptNumber: a.attemptNumber,
      score: a.score,
      startedAt: a.startedAt,
      timeSpent: a.timeSpentSeconds,
      grade: getGradeLabel(a.score)
    }))
  };

  // If role is not admin / superuser / manager, skip heavy global aggregate to save memory, just return individual and skeleton global
  if (!isAdminOrSuperOrManager(user)) {
    res.json({ individual: individualStats, global: null });
    return;
  }

  const isManager = user.role === 'manager';
  const managerDept = user.department;

  // Aggregate Global Administrator Statistics
  let allUsers = DBManager.getUsers().filter(u => u.role !== 'admin' && u.username !== 'pvantho@pdu.edu.vn');
  let allAttempts = DBManager.getAttempts().filter(a => a.completedAt);

  if (isManager) {
    allUsers = allUsers.filter(u => u.department === managerDept);
    allAttempts = allAttempts.filter(a => a.userDepartment === managerDept);
  }

  // Group attempts by user to find individual highest official score
  const userHighestScores: { [userId: string]: number } = {};
  allAttempts.forEach(att => {
    if (userHighestScores[att.userId] === undefined || att.score > userHighestScores[att.userId]) {
      userHighestScores[att.userId] = att.score;
    }
  });

  const attemptedUserIds = Object.keys(userHighestScores);
  const totalAttempted = attemptedUserIds.length;
  const totalNotAttempted = Math.max(0, allUsers.length - totalAttempted);

  let totalScoresSum = 0;
  let passCount = 0;
  let failCount = 0;

  attemptedUserIds.forEach(uId => {
    const highest = userHighestScores[uId];
    totalScoresSum += highest;
    if (highest >= 50) {
      passCount++;
    } else {
      failCount++;
    }
  });

  const averageScore = totalAttempted > 0 ? Math.round((totalScoresSum / totalAttempted) * 10) / 10 : 0;
  const passRate = totalAttempted > 0 ? Math.round((passCount / totalAttempted) * 100) : 0;
  const failRate = totalAttempted > 0 ? Math.round((failCount / totalAttempted) * 100) : 0;

  // Department / Commune Breakdown
  const departmentGroups: { [commune: string]: { total: number; attempted: number; scores: number[] } } = {};
  
  // Init map with Hanoi communes
  DIRECTORY_DEPARTMENTS.forEach(dep => {
    departmentGroups[dep] = { total: 0, attempted: 0, scores: [] };
  });

  allUsers.forEach(u => {
    const dep = u.department || "Khác";
    if (!departmentGroups[dep]) {
      departmentGroups[dep] = { total: 0, attempted: 0, scores: [] };
    }
    departmentGroups[dep].total++;
    
    if (userHighestScores[u.id] !== undefined) {
      departmentGroups[dep].attempted++;
      departmentGroups[dep].scores.push(userHighestScores[u.id]);
    }
  });

  const departmentStats = Object.keys(departmentGroups).map(name => {
    const g = departmentGroups[name];
    const scoresCount = g.scores.length;
    const avgScore = scoresCount > 0 ? Math.round((g.scores.reduce((a,b)=>a+b, 0) / scoresCount) * 10) / 10 : 0;
    const passedCount = g.scores.filter(s => s >= 50).length;
    const pRate = scoresCount > 0 ? Math.round((passedCount / scoresCount) * 100) : 0;

    return {
      name,
      totalUsers: g.total,
      attemptedUsers: g.attempted,
      averageScore: avgScore,
      passRate: pRate
    };
  }).filter(d => d.totalUsers > 0); // Only return communes that have users

  res.json({
    individual: individualStats,
    global: {
      totalRegistered: allUsers.length,
      totalAttempted,
      totalNotAttempted,
      averageScore,
      passCount,
      failCount,
      passRate,
      failRate,
      departmentStats
    }
  });
});

app.get("/api/admin/attempts", authenticate, (req: any, res) => {
  if (!isAdminOrSuperOrManager(req.user)) {
    res.status(403).json({ error: "Quyền truy cập bị từ chối." });
    return;
  }
  let attempts = DBManager.getAttempts();
  if (req.user.role === 'manager') {
    attempts = attempts.filter(a => a.userDepartment === req.user.department);
  }
  res.json(attempts);
});

app.get("/api/admin/users", authenticate, (req: any, res) => {
  if (!isAdminOrSuperOrManager(req.user)) {
    res.status(403).json({ error: "Quyền truy cập bị từ chối." });
    return;
  }
  
  let rawUsers = DBManager.getUsers().filter(u => u.role !== 'admin' && u.username !== 'pvantho@pdu.edu.vn');
  if (req.user.role === 'manager') {
    rawUsers = rawUsers.filter(u => u.department === req.user.department);
  }

  // Strip passwords for safety
  const allUsers = rawUsers.map(u => ({
    id: u.id,
    username: u.username,
    fullName: u.fullName,
    role: u.role,
    department: u.department,
    createdAt: u.createdAt,
    attemptsCount: DBManager.getAttemptsByUser(u.id).filter(a => a.completedAt).length
  }));
  res.json(allUsers);
});

app.get("/api/admin/audit-logs", authenticate, (req: any, res) => {
  if (!isAdminOrSuperOrManager(req.user)) {
    res.status(403).json({ error: "Quyền truy cập bị từ chối." });
    return;
  }
  let logs = DBManager.getLogs();
  if (req.user.role === 'manager') {
    const userNamesInDept = new Set(DBManager.getUsers().filter(u => u.department === req.user.department).map(u => u.username));
    logs = logs.filter(log => userNamesInDept.has(log.username));
  }
  res.json(logs);
});

app.post("/api/admin/users/reset-attempts", authenticate, (req: any, res) => {
  if (!isAdminOrSuperOrManager(req.user)) {
    res.status(403).json({ error: "Quyền truy cập bị từ chối." });
    return;
  }
  const { userId } = req.body;
  if (!userId) {
    res.status(400).json({ error: "Thiếu mã thông tin nhân sự cần thiết" });
    return;
  }
  
  const targetUser = DBManager.getUserById(userId);
  if (!targetUser) {
    res.status(404).json({ error: "Không tìm thấy cán bộ." });
    return;
  }

  if (req.user.role === 'manager' && targetUser.department !== req.user.department) {
    res.status(403).json({ error: "Bạn không có quyền quản lý cán bộ thuộc đơn vị khác." });
    return;
  }

  DBManager.resetAttempts(userId);
  DBManager.logAction(
    req.user.id,
    req.user.username,
    req.user.fullName,
    "Đặt lại số lần thi",
    `Xóa toàn bộ lịch sử thi và đặt lại lượt thi về 0 cho cán bộ: ${targetUser.fullName} (${targetUser.username})`,
    req.ip || "127.0.0.1",
    req.headers["user-agent"] || "unknown"
  );
  res.json({ status: "success", message: `Đã reset lượt thi của cán bộ ${targetUser.fullName} về 0 thành công!` });
});

app.get("/api/admin/questions-stats", authenticate, (req: any, res) => {
  if (!isAdminOrSuper(req.user)) {
    res.status(403).json({ error: "Quyền truy cập bị từ chối." });
    return;
  }
  res.json({
    choiceCount: DBManager.getQuestions().length,
    scenarioCount: DBManager.getScenarios().length,
    questions: DBManager.getQuestions(),
    scenarios: DBManager.getScenarios()
  });
});

// --- SUPER USER USER DELEGATION ENDPOINTS ---

app.get("/api/superuser/managers", authenticate, (req: any, res) => {
  if (req.user.role !== 'superuser') {
    res.status(403).json({ error: "Chức năng này chỉ dành cho Super User." });
    return;
  }
  
  const managers = DBManager.getUsers()
    .filter(u => u.role === 'manager' || u.role === 'superuser')
    .map(u => ({
      id: u.id,
      username: u.username,
      fullName: u.fullName,
      role: u.role,
      department: u.department,
      createdAt: u.createdAt
    }));
  res.json(managers);
});

app.post("/api/superuser/assign-manager", authenticate, (req: any, res) => {
  if (req.user.role !== 'superuser') {
    res.status(403).json({ error: "Chức năng này chỉ dành cho Super User." });
    return;
  }

  const { email, fullName, department } = req.body;
  if (!email || !fullName || !department) {
    res.status(400).json({ error: "Vui lòng nhập đầy đủ email, họ tên và đơn vị quản lý." });
    return;
  }

  const emailNorm = email.trim().toLowerCase();
  if (!emailNorm.endsWith('@gmail.com') && emailNorm !== 'pvantho@pdu.edu.vn') {
    res.status(400).json({ error: "Tài khoản được phân quyền phải là Gmail (@gmail.com)." });
    return;
  }

  try {
    let user = DBManager.getUserByUsername(emailNorm);
    if (!user) {
      // Create user
      user = DBManager.registerGmailUser(emailNorm, fullName, department);
    }
    
    // Elevate role to manager
    user.role = 'manager';
    user.fullName = fullName;
    user.department = department;
    DBManager.saveUser(user);

    DBManager.logAction(
      req.user.id,
      req.user.username,
      req.user.fullName,
      "Phân quyền Quản lý",
      `Phân quyền tài khoản quản lý cho Gmail: ${emailNorm} phụ trách đơn vị: ${department}`,
      req.ip || "127.0.0.1",
      req.headers["user-agent"] || "unknown"
    );

    res.json({ success: true, message: `Phân quyền thành công cho quản lý ${fullName} thuộc đơn vị ${department}.` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Không thể phân quyền quản lý." });
  }
});

app.post("/api/superuser/remove-manager", authenticate, (req: any, res) => {
  if (req.user.role !== 'superuser') {
    res.status(403).json({ error: "Chức năng này chỉ dành cho Super User." });
    return;
  }

  const { userId } = req.body;
  if (!userId) {
    res.status(400).json({ error: "Thiếu mã thông tin cán bộ." });
    return;
  }

  const user = DBManager.getUserById(userId);
  if (!user) {
    res.status(404).json({ error: "Không tìm thấy cán bộ." });
    return;
  }

  if (user.username.toLowerCase() === "pvantho@pdu.edu.vn") {
    res.status(400).json({ error: "Không thể thu hồi quyền Super User chính mình." });
    return;
  }

  const oldDept = user.department;
  user.role = 'user'; // Downgrade to normal user
  DBManager.saveUser(user);

  DBManager.logAction(
    req.user.id,
    req.user.username,
    req.user.fullName,
    "Thu hồi quyền Quản lý",
    `Thu hồi quyền quản lý của Gmail: ${user.username} thuộc đơn vị: ${oldDept}, thu về học viên thường.`,
    req.ip || "127.0.0.1",
    req.headers["user-agent"] || "unknown"
  );

  res.json({ success: true, message: `Đã thu hồi quyền quản lý của ${user.fullName} thành công.` });
});

app.post("/api/admin/questions/edit", authenticate, (req: any, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superuser') {
    res.status(403).json({ error: "Quyền truy cập bị từ chối." });
    return;
  }
  const { id, category, difficulty, questionText, choices, correctAnswerId, explanation } = req.body;
  if (!id || !questionText || !choices || !correctAnswerId || !difficulty || !category) {
    res.status(400).json({ error: "Vui lòng điền đầy đủ nội dung câu hỏi bắt buộc." });
    return;
  }
  const success = DBManager.updateQuestion(id, {
    category,
    difficulty,
    questionText,
    choices,
    correctAnswerId,
    explanation
  });
  if (success) {
    DBManager.logAction(
      req.user.id,
      req.user.username,
      req.user.fullName,
      "Chỉnh sửa câu hỏi",
      `Sửa câu hỏi trắc nghiệm ID: ${id} hoàn tất`,
      req.ip || "127.0.0.1",
      req.headers["user-agent"] || "unknown"
    );
    res.json({ success: true, message: "Đã cập nhật câu hỏi trắc nghiệm thành công." });
  } else {
    res.status(404).json({ error: "Không tìm thấy câu hỏi tương ứng." });
  }
});

app.post("/api/admin/questions/delete", authenticate, (req: any, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superuser') {
    res.status(403).json({ error: "Quyền truy cập bị từ chối." });
    return;
  }
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ error: "Thiếu mã câu hỏi cần xóa." });
    return;
  }
  const success = DBManager.deleteQuestion(id);
  if (success) {
    DBManager.logAction(
      req.user.id,
      req.user.username,
      req.user.fullName,
      "Xóa câu hỏi",
      `Xóa câu hỏi trắc nghiệm mang ID: ${id}`,
      req.ip || "127.0.0.1",
      req.headers["user-agent"] || "unknown"
    );
    res.json({ success: true, message: "Đã xóa câu hỏi khỏi ngân hàng đề thi." });
  } else {
    res.status(404).json({ error: "Không tìm thấy câu hỏi tương ứng." });
  }
});

app.post("/api/admin/questions/clear-all", authenticate, (req: any, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superuser') {
    res.status(403).json({ error: "Quyền truy cập bị từ chối." });
    return;
  }
  const countBefore = DBManager.getQuestions().length;
  DBManager.setQuestions([]);
  DBManager.logAction(
    req.user.id,
    req.user.username,
    req.user.fullName,
    "Xóa sạch câu hỏi",
    `Xóa toàn bộ ${countBefore} câu hỏi trắc nghiệm trực quan khỏi hệ thống`,
    req.ip || "127.0.0.1",
    req.headers["user-agent"] || "unknown"
  );
  res.json({ success: true, message: `Thực hiện xóa toàn bộ của ${countBefore} câu hỏi trắc nghiệm thành công!` });
});

app.post("/api/admin/scenarios/clear-all", authenticate, (req: any, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superuser') {
    res.status(403).json({ error: "Quyền truy cập bị từ chối." });
    return;
  }
  const countBefore = DBManager.getScenarios().length;
  DBManager.setScenarios([]);
  DBManager.logAction(
    req.user.id,
    req.user.username,
    req.user.fullName,
    "Xóa sạch tình huống",
    `Xóa toàn bộ ${countBefore} câu hỏi tình huống 3 bước khỏi hệ thống`,
    req.ip || "127.0.0.1",
    req.headers["user-agent"] || "unknown"
  );
  res.json({ success: true, message: `Thực hiện xóa toàn bộ ${countBefore} tình huống 3 bước thành công!` });
});

app.post("/api/admin/questions/add", authenticate, (req: any, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superuser') {
    res.status(403).json({ error: "Quyền truy cập bị từ chối." });
    return;
  }
  const { category, difficulty, questionText, choices, correctAnswerId, explanation } = req.body;
  if (!questionText || !choices || !correctAnswerId || !difficulty || !category) {
    res.status(400).json({ error: "Vui lòng điền đầy đủ dữ liệu cấu trúc câu hỏi." });
    return;
  }
  const newQ: Question = {
    id: `q_manual_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    category,
    difficulty,
    questionText,
    choices,
    correctAnswerId,
    explanation
  };
  DBManager.addQuestion(newQ);
  DBManager.logAction(
    req.user.id,
    req.user.username,
    req.user.fullName,
    "Thêm câu hỏi",
    `Thêm mới câu hỏi trắc nghiệm ID: ${newQ.id} vào ngân hàng đề`,
    req.ip || "127.0.0.1",
    req.headers["user-agent"] || "unknown"
  );
  res.json({ success: true, message: "Đã thêm câu hỏi mới thành công.", question: newQ });
});

app.post("/api/admin/questions/import-json", authenticate, (req: any, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superuser') {
    res.status(403).json({ error: "Quyền truy cập bị từ chối." });
    return;
  }
  const { questions } = req.body;
  if (!questions) {
    res.status(400).json({ error: "Vui lòng nhập định dạng dữ liệu JSON hợp lệ." });
    return;
  }

  // Support single object or array
  const rawList = Array.isArray(questions) ? questions : [questions];
  let importedCount = 0;
  const errors: string[] = [];

  for (let idx = 0; idx < rawList.length; idx++) {
    const item = rawList[idx];
    const text = item.text || item.questionText;
    const opts = item.opts || (item.choices && item.choices.map((c: any) => c.text));
    const topic = item.topic || item.category;

    if (!text) {
      errors.push(`Vị trí thứ ${idx + 1}: Thiếu nội dung câu hỏi (truyền qua trường "text")`);
      continue;
    }
    if (!opts || !Array.isArray(opts) || opts.length === 0) {
      errors.push(`Vị trí thứ ${idx + 1}: Thiếu các lựa chọn phương án (truyền qua danh sách "opts")`);
      continue;
    }

    // Determine category
    let category: any = 'law';
    if (topic) {
      const t = String(topic).toLowerCase().trim();
      if (t === 'dulieu' || t === 'data' || t === 'dữ liệu' || t === 'baove' || t === 'bao_ve') category = 'data';
      else if (t === 'law' || t === 'phapluat' || t === 'pháp luật' || t === 'quy_dinh') category = 'law';
      else if (t === 'computer' || t === 'maytinh' || t === 'máy tính') category = 'computer';
      else if (t === 'phishing' || t === 'luadao' || t === 'lừa đảo') category = 'phishing';
      else if (t === 'account' || t === 'taikhoan' || t === 'tài khoản') category = 'account';
    }

    // Choices
    const choices = opts.map((optStr: any, optIdx: number) => {
      const optionId = String.fromCharCode(65 + optIdx);
      let cleanedText = String(optStr).trim();
      const prefixRegex = new RegExp(`^[A-E]\\s*[:.)-]\\s*`, 'i');
      if (prefixRegex.test(cleanedText)) {
        cleanedText = cleanedText.replace(prefixRegex, '');
      }
      return { id: optionId, text: cleanedText };
    });

    // Answer ID
    let correctAnswerId = 'A';
    if (typeof item.ans === 'number') {
      correctAnswerId = String.fromCharCode(65 + item.ans);
    } else if (typeof item.correctAnswerId === 'string') {
      correctAnswerId = item.correctAnswerId.trim().toUpperCase();
    } else if (typeof item.ans === 'string') {
      const ansStr = item.ans.trim().toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(ansStr)) {
        correctAnswerId = ansStr;
      }
    }

    // Use a clean manual ID or standard numbering
    const newQ: Question = {
      id: item.id ? `q_import_${item.id}` : `q_manual_import_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      category,
      difficulty: item.difficulty || 'medium',
      questionText: text,
      choices,
      correctAnswerId,
      explanation: item.explanation || item.explain || 'Nhập từ cấu trúc JSON'
    };

    // Use DBManager's set/update/add
    const exists = DBManager.getQuestions().some((existingQ: any) => existingQ.id === newQ.id);
    if (exists) {
      DBManager.updateQuestion(newQ.id, newQ);
    } else {
      DBManager.addQuestion(newQ);
    }
    importedCount++;
  }

  if (importedCount > 0) {
    DBManager.logAction(
      req.user.id,
      req.user.username,
      req.user.fullName,
      "Nhập câu hỏi JSON",
      `Tự động import thành công ${importedCount} câu hỏi trắc nghiệm qua tính năng nạp đề khách`,
      req.ip || "127.0.0.1",
      req.headers["user-agent"] || "unknown"
    );
  }

  res.json({
    success: true,
    message: `Đã nạp thành công ${importedCount} câu hỏi vào hệ thống!`,
    errors: errors.length > 0 ? errors : undefined
  });
});

app.post("/api/admin/scenarios/edit", authenticate, (req: any, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superuser') {
    res.status(403).json({ error: "Quyền truy cập bị từ chối." });
    return;
  }
  const { id, topic, scenarioText, step1, step2, step3, explanation } = req.body;
  if (!id || !topic || !scenarioText || !step1 || !step2 || !step3) {
    res.status(400).json({ error: "Vui lòng điền đầy đủ cấu trúc tình huống 3 bước." });
    return;
  }
  const success = DBManager.updateScenario(id, {
    topic,
    scenarioText,
    step1,
    step2,
    step3,
    explanation
  });
  if (success) {
    DBManager.logAction(
      req.user.id,
      req.user.username,
      req.user.fullName,
      "Chỉnh sửa tình huống",
      `Sửa tình huống 3 bước ID: ${id} hoàn tất`,
      req.ip || "127.0.0.1",
      req.headers["user-agent"] || "unknown"
    );
    res.json({ success: true, message: "Đã cập nhật tình huống thành công." });
  } else {
    res.status(404).json({ error: "Không tìm thấy tình huống tương ứng." });
  }
});

app.post("/api/admin/scenarios/delete", authenticate, (req: any, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superuser') {
    res.status(403).json({ error: "Quyền truy cập bị từ chối." });
    return;
  }
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ error: "Thiếu mã tình huống cần xóa." });
    return;
  }
  const success = DBManager.deleteScenario(id);
  if (success) {
    DBManager.logAction(
      req.user.id,
      req.user.username,
      req.user.fullName,
      "Xóa tình huống",
      `Xóa tình huống mang ID: ${id}`,
      req.ip || "127.0.0.1",
      req.headers["user-agent"] || "unknown"
    );
    res.json({ success: true, message: "Đã xóa tình huống khỏi ngân hàng đề thi." });
  } else {
    res.status(404).json({ error: "Không tìm thấy tình huống tương ứng." });
  }
});

app.post("/api/admin/scenarios/add", authenticate, (req: any, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superuser') {
    res.status(403).json({ error: "Quyền truy cập bị từ chối." });
    return;
  }
  const { topic, scenarioText, step1, step2, step3, explanation } = req.body;
  if (!topic || !scenarioText || !step1 || !step2 || !step3) {
    res.status(400).json({ error: "Vui lòng nhập đầy đủ cấu trúc tình huống 3 bước." });
    return;
  }
  const newS: ScenarioQuestion = {
    id: `sc_manual_${Date.now()}_${Math.random().toString(36).substring(2,7)}`,
    topic,
    scenarioText,
    step1,
    step2,
    step3,
    explanation
  };
  DBManager.addScenario(newS);
  DBManager.logAction(
    req.user.id,
    req.user.username,
    req.user.fullName,
    "Thêm tình huống",
    `Thêm tình huống 3 bước ID: ${newS.id} vào ngân hàng đề`,
    req.ip || "127.0.0.1",
    req.headers["user-agent"] || "unknown"
  );
  res.json({ success: true, message: "Đã thêm tình huống mới thành công.", scenario: newS });
});

// --- REBUILD ALL core BANK WITH AI STEP-BY-STEP OVER THE GEMINI ENDPOINT ---
app.post("/api/admin/rebuild-bank-ai", authenticate, async (req: any, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superuser') {
    res.status(403).json({ error: "Quyền truy cập bị từ chối." });
    return;
  }

  const { step } = req.body; // Step 1 to 6
  if (step === undefined || step < 1 || step > 6) {
    res.status(400).json({ error: "Tham số bước xây dựng (step) không hợp lệ." });
    return;
  }

  try {
    const ai = getGeminiClient();
    
    // Step 1: Generates exactly 20 law questions & clears target questions pool
    if (step === 1) {
      const p = "Hãy tạo chính xác 20 câu hỏi trắc nghiệm tiếng Việt mới (Duy nhất 1 đáp án đúng) bám sát chuyên đề 'Quy định pháp luật về an toàn thông tin' (gán category là 'law') dành cho công chức xã phường.\n" +
        "Phân chia độ khó như sau: 10 câu dễ (difficulty: 'easy'), 5 câu trung bình (difficulty: 'medium'), 5 câu khó (difficulty: 'hard').\n" +
        "Mỗi câu hỏi phải có chính xác 4 đáp án (A, B, C, D) và 1 đáp án đúng duy nhất, kèm độ khó và giải thích lý thuyết chi tiết tại sao đúng.\n" +
        "Sử dụng các bối cảnh hành chính nhà nước Việt Nam, ví dụ như Luật An ninh mạng, Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, Nghị định 85/2016/NĐ-CP, Quy chế thành phố/tỉnh... để câu hỏi sinh động.\n" +
        "Chỉ xuất dữ liệu dạng JSON Array để parse trực tiếp bằng JSON.parse().";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: p,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                category: { type: Type.STRING },
                questionText: { type: Type.STRING },
                choices: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING }
                    }
                  }
                },
                correctAnswerId: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          }
        }
      });

      const loaded: Question[] = JSON.parse(response.text.trim());
      // Re-assign IDs for protection
      loaded.forEach((q, idx) => {
        q.id = `law_ai_idx_${Date.now()}_${idx}_${Math.random().toString(36).substring(2,5)}`;
        q.category = 'law';
        if (!['easy', 'medium', 'hard'].includes(q.difficulty)) q.difficulty = 'easy';
      });

      // Clear preexisting questions pool first since we are starting Step 1
      DBManager.setQuestions(loaded);

      res.json({ message: "Khởi tạo thành công 20 câu hỏi Quy định pháp luật số (law) bằng AI!", count: loaded.length });
      return;
    }

    // Step 2: Generates exactly 20 computer questions & appends
    if (step === 2) {
      const p = "Hãy tạo chính xác 20 câu hỏi trắc nghiệm tiếng Việt mới (Duy nhất 1 đáp án đúng) bám sát chuyên đề 'Sử dụng máy tính an toàn' (category là 'computer') dành cho công chức xã phường.\n" +
        "Phân chia độ khó: 10 câu dễ (easy), 5 câu trung bình (medium), 5 câu khó (hard).\n" +
        "Mỗi câu hỏi phải có chính xác 4 đáp án (A, B, C, D) và 1 đáp án đúng duy nhất, kèm độ khó và giải thích hành vi cụ thể (khóa màn hình Win+L, quét virus USB, tắt máy, phần mềm bản quyền...).\n" +
        "Chỉ xuất dữ liệu dạng JSON Array.";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: p,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                category: { type: Type.STRING },
                questionText: { type: Type.STRING },
                choices: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING }
                    }
                  }
                },
                correctAnswerId: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          }
        }
      });

      const loaded: Question[] = JSON.parse(response.text.trim());
      loaded.forEach((q, idx) => {
        q.id = `computer_ai_idx_${Date.now()}_${idx}_${Math.random().toString(36).substring(2,5)}`;
        q.category = 'computer';
        if (!['easy', 'medium', 'hard'].includes(q.difficulty)) q.difficulty = 'easy';
      });

      // Append
      const prevList = DBManager.getQuestions();
      DBManager.setQuestions(prevList.concat(loaded));

      res.json({ message: "Bổ sung thành công 20 câu hỏi Sử dụng máy tính an toàn (computer) bằng AI!", count: loaded.length });
      return;
    }

    // Step 3: Generates exactly 20 phishing questions & appends
    if (step === 3) {
      const p = "Hãy tạo chính xác 20 câu hỏi trắc nghiệm tiếng Việt mới (Duy nhất 1 đáp án đúng) bám sát chuyên đề 'Nhận diện lừa đảo trực tuyến' (category: 'phishing') dành cho công chức hành chính công.\n" +
        "Phân chia độ khó: 10 câu dễ (easy), 5 câu trung bình (medium), 5 câu khó (hard).\n" +
        "Mỗi câu hỏi phải gồm 4 đáp án (A, B, C, D), giải thích lừa đảo mạo danh ngân hàng, giả thư Bộ, giả mạo sếp Sở, các fanpage tuyển dụng lừa đảo, hoặc link lạ chứa virus.\n" +
        "Chỉ xuất dữ liệu dạng JSON Array.";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: p,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                category: { type: Type.STRING },
                questionText: { type: Type.STRING },
                choices: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING }
                    }
                  }
                },
                correctAnswerId: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          }
        }
      });

      const loaded: Question[] = JSON.parse(response.text.trim());
      loaded.forEach((q, idx) => {
        q.id = `phishing_ai_idx_${Date.now()}_${idx}_${Math.random().toString(36).substring(2,5)}`;
        q.category = 'phishing';
        if (!['easy', 'medium', 'hard'].includes(q.difficulty)) q.difficulty = 'easy';
      });

      // Append
      const prevList = DBManager.getQuestions();
      DBManager.setQuestions(prevList.concat(loaded));

      res.json({ message: "Bổ sung thành công 20 câu hỏi Nhận diện lừa đảo trực tuyến (phishing) bằng AI!", count: loaded.length });
      return;
    }

    // Step 4: Generates exactly 20 account questions & appends
    if (step === 4) {
      const p = "Hãy tạo chính xác 20 câu hỏi trắc nghiệm tiếng Việt mới (Duy nhất 1 đáp án đúng) bám sát chuyên đề 'Quản lý tài khoản số' (category: 'account') dành cho cán bộ công vụ hành chính.\n" +
        "Phân chia độ khó: 10 câu dễ (easy), 5 câu trung bình (medium), 5 câu khó (hard).\n" +
        "Nội dung: Bảo mật mật khẩu, xác thực hai lớp (2FA), mã OTP, cảnh báo đăng nhập lạ, việc cho mượn tài khoản nội bộ.\n" +
        "Chỉ xuất dữ liệu dạng JSON Array.";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: p,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                category: { type: Type.STRING },
                questionText: { type: Type.STRING },
                choices: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING }
                    }
                  }
                },
                correctAnswerId: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          }
        }
      });

      const loaded: Question[] = JSON.parse(response.text.trim());
      loaded.forEach((q, idx) => {
        q.id = `account_ai_idx_${Date.now()}_${idx}_${Math.random().toString(36).substring(2,5)}`;
        q.category = 'account';
        if (!['easy', 'medium', 'hard'].includes(q.difficulty)) q.difficulty = 'easy';
      });

      // Append
      const prevList = DBManager.getQuestions();
      DBManager.setQuestions(prevList.concat(loaded));

      res.json({ message: "Bổ sung thành công 20 câu hỏi Quản lý tài khoản số (account) bằng AI!", count: loaded.length });
      return;
    }

    // Step 5: Generates exactly 20 data questions & appends
    if (step === 5) {
      const p = "Hãy tạo chính xác 20 câu hỏi trắc nghiệm tiếng Việt mới (Duy nhất 1 đáp án đúng) bám sát chuyên đề 'Quản lý dữ liệu số' (category: 'data') dành cho cán bộ cấp cơ sở.\n" +
        "Phân chia độ khó: 10 câu dễ (easy), 5 câu trung bình (medium), 5 câu khó (hard).\n" +
        "Nội dung: Sao lưu đám mây, sao lưu ổ cứng ngoài, bảo vệ file Excel danh sách chứa số điện thoại/ID, rò rỉ khi tải file lên công cụ PDF online, chia sẻ file công vụ qua mạng xã hội công cộng.\n" +
        "Chỉ xuất dữ liệu dạng JSON Array.";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: p,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                category: { type: Type.STRING },
                questionText: { type: Type.STRING },
                choices: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING }
                    }
                  }
                },
                correctAnswerId: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          }
        }
      });

      const loaded: Question[] = JSON.parse(response.text.trim());
      loaded.forEach((q, idx) => {
        q.id = `data_ai_idx_${Date.now()}_${idx}_${Math.random().toString(36).substring(2,5)}`;
        q.category = 'data';
        if (!['easy', 'medium', 'hard'].includes(q.difficulty)) q.difficulty = 'easy';
      });

      // Append
      const prevList = DBManager.getQuestions();
      DBManager.setQuestions(prevList.concat(loaded));

      res.json({ message: "Bổ sung thành công 20 câu hỏi Quản lý dữ liệu số (data) bằng AI! Đủ tổng cộng 100 câu!", count: loaded.length });
      return;
    }

    // Step 6: Generates exactly 10 scenarios & resets scenarios pool
    if (step === 6) {
      const p = "Hãy tạo chính xác 10 kịch bản tình huống thực tế an toàn thông tin mới (tiếng Việt). " +
        "Yêu cầu bao quát sâu 5 chủ đề huấn luyện: 'Email giả mạo sếp Sở', 'Rò rỉ dữ liệu qua Zalo', 'Mã độc tống tiền ransomware dữ liệu tài chính', 'Cho mượn tài khoản hệ thống một cửa', 'Cắm USB lạ cứu hộ'. Mỗi chủ đề phải có chính xác 2 kịch bản chi tiết lý giải sư phạm.\n" +
        "Mỗi tình huống bao gồm 3 bước trắc nghiệm lựa chọn (A, B, C, D) như cấu trúc mẫu:\n" +
        "[\n" +
        "  {\n" +
        "    \"id\": \"scenario_ai_unique_1\",\n" +
        "    \"topic\": \"Email giả mạo\",\n" +
        "    \"scenarioText\": \"Bối cảnh xã nhận được email từ hòm thư lạ xưng danh...\",\n" +
        "    \"step1\": { \"prompt\": \"Đâu là dấu hiệu nghi vấn đầu tiên?\", \"choices\": [{\"id\":\"A\",\"text\":\"Tên hiển thị giống nhưng đuôi mail lạ\"}, {\"id\":\"B\",\"text\":\"Lời chào trang trọng\"}, {\"id\":\"C\",\"text\":\"Nội dung ngắn gọn\"}, {\"id\":\"D\",\"text\":\"Có đính kèm file PDF\"}], \"correctAnswerId\": \"A\" },\n" +
        "    \"step2\": { \"prompt\": \"Cán bộ một cửa cần hành động gì khẩn cấp?\", \"choices\": [{\"id\":\"A\",\"text\":\"Tải file về máy xem thử\"}, {\"id\":\"B\",\"text\":\"Liên hệ xác minh bằng kênh thứ hai trực tiếp\"}, {\"id\":\"C\",\"text\":\"Chuyển tiếp cho đồng nghiệp cứu trợ\"}, {\"id\":\"D\",\"text\":\"Bỏ qua không xử lý\"}], \"correctAnswerId\": \"B\" },\n" +
        "    \"step3\": { \"prompt\": \"Ý nghĩa hành vi phòng thủ chuẩn quốc gia là gì?\", \"choices\": [{\"id\":\"A\",\"text\":\"Bảo vệ hệ thống công vụ\"}, {\"id\":\"B\",\"text\":\"Tránh bị đánh giá kém chuyên môn\"}, {\"id\":\"C\",\"text\":\"Ngăn ngừa tin tặc chiếm quyền điều khiển hạ tầng\"}, {\"id\":\"D\",\"text\":\"Đảm bảo đúng quy trình hành chính hành sở\"}], \"correctAnswerId\": \"C\" },\n" +
        "    \"explanation\": \"Gợi ý bài học sâu sắc...\"\n" +
        "  }\n" +
        "]";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: p,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                topic: { type: Type.STRING },
                scenarioText: { type: Type.STRING },
                step1: {
                  type: Type.OBJECT,
                  properties: {
                    prompt: { type: Type.STRING },
                    choices: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING }
                        }
                      }
                    },
                    correctAnswerId: { type: Type.STRING }
                  }
                },
                step2: {
                  type: Type.OBJECT,
                  properties: {
                    prompt: { type: Type.STRING },
                    choices: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING }
                        }
                      }
                    },
                    correctAnswerId: { type: Type.STRING }
                  }
                },
                step3: {
                  type: Type.OBJECT,
                  properties: {
                    prompt: { type: Type.STRING },
                    choices: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING }
                        }
                      }
                    },
                    correctAnswerId: { type: Type.STRING }
                  }
                },
                explanation: { type: Type.STRING }
              }
            }
          }
        }
      });

      const loaded: ScenarioQuestion[] = JSON.parse(response.text.trim());
      loaded.forEach((s, idx) => {
        s.id = `scenario_ai_idx_${Date.now()}_${idx}_${Math.random().toString(36).substring(2,5)}`;
      });

      // Completely clear existing scenarios and save 10 new scenarios
      DBManager.setScenarios(loaded);

      DBManager.logAction(
        req.user.id,
        req.user.username,
        req.user.fullName,
        "Đồng bộ Toàn bộ AI",
        "Khởi tạo thành công 100 câu hỏi trắc nghiệm quốc gia và 10 kịch bản tình huống thực tế an toàn thông tin chuyên sâu thông qua Gemini AI hoàn tất!",
        req.ip || "127.0.0.1",
        req.headers["user-agent"] || "unknown"
      );

      res.json({ message: "Khởi tạo thành công 10 tình huống thực tế bằng AI! Hoàn thành quy trình tái lập ngân hàng lõi!", count: loaded.length });
      return;
    }

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Lỗi tại bước " + step + ": " + (err.message || "Gặp sự cố kết nối AI.") });
  }
});

// --- AI GENERATION WITH GEMINI ENDPOINT ---
app.post("/api/admin/generate-questions-ai", authenticate, async (req: any, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superuser') {
    res.status(403).json({ error: "Quyền truy cập bị từ chối." });
    return;
  }

  const { type } = req.body; // "choice" or "scenario"
  
  try {
    const ai = getGeminiClient();
    
    if (type === "choice") {
      const p = "Hãy tạo 5 câu hỏi trắc nghiệm tiếng Việt mới (Duy nhất 1 đáp án đúng) bám sát các chuyên đề an toàn và bảo mật thông tin số của công chức xã phường." +
        "Phân bổ ngẫu nhiên chủ đề trong các từ khóa sau: 'Quy định pháp luật về an toàn thông tin' (được gán category là 'law'), 'Sử dụng máy tính an toàn' (category 'computer'), 'Nhận diện lừa đảo trực tuyến' (category 'phishing'), 'Quản lý tài khoản số' (category 'account'), 'Quản lý dữ liệu số' (category 'data').\n" +
        "Mỗi câu hỏi phải có chính xác 4 đáp án (A, B, C, D) và 1 đáp án đúng duy nhất, kèm độ khó (easy, medium, hard) và giải thích lý thuyết chi tiết tại sao đúng.\n" +
        "Hãy trả về định dạng mảng JSON thuần túy, tuyệt đối không có dấu ngoặc markdown (như ```json) hay bất kỳ giải thích chữ nào ngoài JSON. Chỉ xuất dữ liệu thô dạng JSON Array để parse trực tiếp bằng JSON.parse().\n" +
        "Ví dụ cấu trúc đầu ra:\n" +
        "[\n" +
        "  {\n" +
        "    \"id\": \"law_ai_unique_1\",\n" +
        "    \"category\": \"law\",\n" +
        "    \"questionText\": \"Nội dung câu hỏi...\",\n" +
        "    \"choices\": [{ \"id\": \"A\", \"text\": \"đáp án A\" }, { \"id\": \"B\", \"text\": \"đáp án B\" }, { \"id\": \"C\", \"text\": \"đáp án C\" }, { \"id\": \"D\", \"text\": \"đáp án D\" }],\n" +
        "    \"correctAnswerId\": \"A\",\n" +
        "    \"difficulty\": \"medium\",\n" +
        "    \"explanation\": \"Giải thích...\"\n" +
        "  }\n" +
        "]";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: p,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                category: { type: Type.STRING },
                questionText: { type: Type.STRING },
                choices: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING }
                    }
                  }
                },
                correctAnswerId: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          }
        }
      });

      const cleanedText = response.text.trim();
      const loaded: Question[] = JSON.parse(cleanedText);
      
      let count = 0;
      loaded.forEach((q: any) => {
        // override id to ensure uniqueness
        q.id = `choice_ai_${Date.now()}_${Math.random().toString(36).substring(2,7)}`;
        DBManager.addQuestion(q);
        count++;
      });

      DBManager.logAction(
        req.user.id,
        req.user.username,
        req.user.fullName,
        "Sinh dữ liệu AI",
        `Đã tự động khởi tạo thêm ${count} câu hỏi trắc nghiệm an toàn thông tin thông qua mô hình Gemini 3.5-Flash thành công!`,
        req.ip || "127.0.0.1",
        req.headers["user-agent"] || "unknown"
      );

      res.json({ message: `Đã sinh thành công ${count} câu hỏi trắc nghiệm AI bổ sung vào ngân hàng!`, count });
    } else {
      const p = "Hãy tạo 2 tình huống thực tế an toàn thông tin mới (tiếng Việt) bám sát các nguy cơ thực tiễn của công chức một cửa xã phường (như lộ mật khẩu, mạo danh email, ransomware địa chính, lộ file Zalo...). " +
        "Mỗi tình huống bao gồm 3 bước: Bước 1: Xác định nguy cơ, Bước 2: Chọn phương án xử lý, Bước 3: Giải thích lý do chọn lựa chọn.\n" +
        "Tất cả các bước đều là dạng trắc nghiệm 4 đáp án (A, B, C, D) để tính điểm chuẩn dễ dàng.\n" +
        "Hãy xuất mảng JSON thuần túy, không định dạng markdown, khớp hoàn toàn cấu trúc dưới đây:\n" +
        "[\n" +
        "  {\n" +
        "    \"id\": \"scenario_ai_1\",\n" +
        "    \"topic\": \"USB chứa mã độc\",\n" +
        "    \"scenarioText\": \"Mô tả tình huống kịch bản mộc mạc...\",\n" +
        "    \"step1\": { \"prompt\": \"Xác định nguy cơ...\", \"choices\": [{\"id\":\"A\",\"text\":\"A\"}, {\"id\":\"B\",\"text\":\"B\"}, {\"id\":\"C\",\"text\":\"C\"}, {\"id\":\"D\",\"text\":\"D\"}], \"correctAnswerId\": \"A\" },\n" +
        "    \"step2\": { \"prompt\": \"Phương án xử lý...\", \"choices\": [{\"id\":\"A\",\"text\":\"A\"}, {\"id\":\"B\",\"text\":\"B\"}, {\"id\":\"C\",\"text\":\"C\"}, {\"id\":\"D\",\"text\":\"D\"}], \"correctAnswerId\": \"B\" },\n" +
        "    \"step3\": { \"prompt\": \"Giải thích lý do...\", \"choices\": [{\"id\":\"A\",\"text\":\"A\"}, {\"id\":\"B\",\"text\":\"B\"}, {\"id\":\"C\",\"text\":\"C\"}, {\"id\":\"D\",\"text\":\"D\"}], \"correctAnswerId\": \"C\" },\n" +
        "    \"explanation\": \"Giải thích tổng quan lý do sư phạm...\"\n" +
        "  }\n" +
        "]";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: p,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                topic: { type: Type.STRING },
                scenarioText: { type: Type.STRING },
                step1: {
                  type: Type.OBJECT,
                  properties: {
                    prompt: { type: Type.STRING },
                    choices: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING }
                        }
                      }
                    },
                    correctAnswerId: { type: Type.STRING }
                  }
                },
                step2: {
                  type: Type.OBJECT,
                  properties: {
                    prompt: { type: Type.STRING },
                    choices: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING }
                        }
                      }
                    },
                    correctAnswerId: { type: Type.STRING }
                  }
                },
                step3: {
                  type: Type.OBJECT,
                  properties: {
                    prompt: { type: Type.STRING },
                    choices: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING }
                        }
                      }
                    },
                    correctAnswerId: { type: Type.STRING }
                  }
                },
                explanation: { type: Type.STRING }
              }
            }
          }
        }
      });

      const cleanedText = response.text.trim();
      const loaded: ScenarioQuestion[] = JSON.parse(cleanedText);
      
      let count = 0;
      loaded.forEach((s: any) => {
        s.id = `scenario_ai_${Date.now()}_${Math.random().toString(36).substring(2,7)}`;
        DBManager.addScenario(s);
        count++;
      });

      DBManager.logAction(
        req.user.id,
        req.user.username,
        req.user.fullName,
        "Sinh dữ liệu AI",
        `Đã tự động khởi tạo thêm ${count} tình huống thực tế an toàn thông tin thông qua mô hình Gemini 3.5-Flash thành công!`,
        req.ip || "127.0.0.1",
        req.headers["user-agent"] || "unknown"
      );

      res.json({ message: `Đã sinh thành công ${count} tình huống AI bổ sung vào ngân hàng!`, count });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Không thể sinh dữ liệu từ AI. Vui lòng kiểm tra API Key." });
  }
});

// --- VITE DEV / PRODUCTION INGRESS MIDDLEWARE ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
