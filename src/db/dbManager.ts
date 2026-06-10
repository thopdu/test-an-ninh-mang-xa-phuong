/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { User, Question, ScenarioQuestion, ExamAttempt, AuditLog } from '../types';
import { DETAILED_POOL_QUESTIONS, DETAILED_POOL_SCENARIOS } from './questionsBank';

interface DatabaseSchema {
  users: User[];
  passwords: { [username: string]: string }; // Simple hash mapping username -> password (for demo login)
  questions: Question[];
  scenarios: ScenarioQuestion[];
  examAttempts: ExamAttempt[];
  auditLogs: AuditLog[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'db.json');

// List of communes (departments) in Quảng Ngãi Province and designated operational administrative areas for highly localized feel
export const DIRECTORY_DEPARTMENTS = [
  "Xã Ya Ly",
  "Xã Đăk Plô",
  "Xã Ba Tơ (Huyện Ba Tơ)",
  "Xã Ba Vì (Huyện Ba Tơ)",
  "Xã An Phú (TP. Quảng Ngãi)",
  "Xã Ba Dinh (Huyện Ba Tơ)",
  "Xã Ba Động (Huyện Ba Tơ)",
  "Xã Ba Gia (Huyện Sơn Tịnh)",
  "Xã Ba Tô (Huyện Ba Tơ)",
  "Xã Ba Vinh (Huyện Ba Tơ)",
  "Xã Ba Xa (Huyện Ba Tơ)",
  "Xã Bình Chương (Huyện Bình Sơn)",
  "Xã Bình Minh (Huyện Bình Sơn)",
  "Xã Tư Nghĩa",
  "Xã Vạn Tường (Huyện Bình Sơn)",
  "Xã Vệ Giang (Huyện Tư Nghĩa)",
  "Xã Xốp",
  "Xã Bờ Y",
  "Xã Cà Đam (Huyện Trà Bồng)",
  "Phường Cẩm Thành (TP. Quảng Ngãi)",
  "Phường Đăk Bla",
  "Phường Đăk Cấm",
  "Xã Đăk Hà",
  "Xã Đăk Kôi",
  "Xã Đăk Long",
  "Xã Đăk Mar",
  "Xã Đăk Môn",
  "Xã Đăk Pék",
  "Xã Đăk Rơ Wa",
  "Xã Đăk Rve",
  "Xã Đăk Sao",
  "Xã Đăk Tô",
  "Xã Đăk Tờ Kan",
  "Xã Đăk Ui",
  "Xã Đặng Thùy Trâm (Huyện Mộ Đức)",
  "Xã Đình Cương (Huyện Nghĩa Hành)",
  "Xã Đông Trà Bồng (Huyện Trà Bồng)",
  "Xã Dục Nông",
  "Phường Đức Phổ (Thị xã Đức Phổ)",
  "Xã Ia Chim",
  "Xã Ia Đal",
  "Xã Ia Tơi",
  "Xã Khánh Cường (Thị xã Đức Phổ)",
  "Xã Kon Braih",
  "Xã Kon Đào",
  "Xã Kon Plông",
  "Phường Kon Tum",
  "Xã Lân Phong (Huyện Mộ Đức)",
  "Xã Long Phụng (Huyện Mộ Đức)",
  "Xã Măng Bút",
  "Xã Măng Đen",
  "Xã Măng Ri",
  "Xã Minh Long (Huyện Minh Long)",
  "Xã Mỏ Cày (Huyện Mộ Đức)",
  "Xã Mộ Đức (Huyện Mộ Đức)",
  "Xã Mô Rai",
  "Xã Nghĩa Giang (Huyện Tư Nghĩa)",
  "Xã Nghĩa Hành (Huyện Nghĩa Hành)",
  "Phường Nghĩa Lộ (TP. Quảng Ngãi)",
  "Xã Ngọc Linh",
  "Xã Ngọk Bay",
  "Xã Ngọk Réo",
  "Đặc khu Lý Sơn (Huyện Lý Sơn)",
  "Xã Ngọk Tụ",
  "Xã Nguyễn Nghiêm (Huyện Mộ Đức)",
  "Xã Phước Giang (Huyện Nghĩa Hành)",
  "Xã Rờ Kơi",
  "Xã Sa Bình",
  "Phường Sa Huỳnh (Thị xã Đức Phổ)",
  "Xã Sa Loong",
  "Xã Sa Thầy",
  "Xã Sơn Hà (Huyện Sơn Hà)",
  "Xã Sơn Hạ (Huyện Sơn Hà)",
  "Xã Sơn Kỳ (Huyện Sơn Hà)",
  "Xã Sơn Linh (Huyện Sơn Hà)",
  "Xã Sơn Mai (Huyện Sơn Hà)",
  "Xã Sơn Tây (Huyện Sơn Tây)",
  "Xã Sơn Tây Hạ (Huyện Sơn Tây)",
  "Xã Sơn Tây Thượng (Huyện Sơn Tây)",
  "Xã Sơn Thủy (Huyện Sơn Hà)",
  "Xã Sơn Tịnh (Huyện Sơn Tịnh)",
  "Xã Tây Trà Bồng (Huyện Trà Bồng)",
  "Xã Thanh Bồng (Huyện Trà Bồng)",
  "Xã Thiện Tín (Huyện Nghĩa Hành)",
  "Xã Thọ Phong (Huyện Sơn Tịnh)",
  "Xã Tịnh Khê (TP. Quảng Ngãi)",
  "Xã Trà Bồng (Huyện Trà Bồng)",
  "Phường Trà Câu (Thị xã Đức Phổ)",
  "Xã Trà Giang (Huyện Trà Bồng)",
  "Xã Trường Giang (Huyện Sơn Tịnh)",
  "Phường Trương Quang Trọng (TP. Quảng Ngãi)",
  "Xã Tu Mơ Rông",
  "Xã Đông Sơn (Huyện Bình Sơn)",
  "Xã Bình Sơn",
  "Xã Đăk Pxi",
  "Xã Tây Trà"
];

export class DBManager {
  private static data: DatabaseSchema = {
    users: [],
    passwords: {},
    questions: [],
    scenarios: [],
    examAttempts: [],
    auditLogs: []
  };

  public static init() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        this.data = JSON.parse(fileContent);
        
        // Ensure arrays exist
        if (!this.data.users) this.data.users = [];
        if (!this.data.passwords) this.data.passwords = {};
        
        let didUpdate = false;
        
        // Auto-seed or auto-upgrade pvantho@pdu.edu.vn to superuser
        const superEmail = "pvantho@pdu.edu.vn";
        const hasSuperUser = this.data.users.find(u => u.username.toLowerCase() === superEmail);
        if (!hasSuperUser) {
          const superUserObj: User = {
            id: "superuser_id",
            username: superEmail,
            fullName: "Phạm Văn Thọ",
            role: "superuser",
            department: "Sở Thông tin và Truyền thông",
            createdAt: new Date().toISOString()
          };
          this.data.users.push(superUserObj);
          this.data.passwords[superEmail] = "gmail_oauth_mock_pass_123";
          didUpdate = true;
        } else if (hasSuperUser.role !== 'superuser') {
          hasSuperUser.role = 'superuser';
          didUpdate = true;
        }

        // Overwrite or fill with detailed pool if bank size is too small or fresh,
        // or if we have obsolete questions to migrate to why/reasons/responsibility formats.
        const hasObsolete = this.data.questions?.some(q => 
          q.questionText.includes("bao nhiêu nhóm nhiệm vụ chính") || 
          q.questionText.includes("Nghị định nào quy định")
        );
        const needsReseed = !this.data.questions || 
          this.data.questions.length < 100 || 
          this.data.questions.some(q => q.id === "q_law_1" && !q.questionText.includes("Nghị định 13/2023/NĐ-CP")) ||
          hasObsolete;
        if (needsReseed) {
          this.data.questions = [...DETAILED_POOL_QUESTIONS];
          didUpdate = true;
        }
        if (!this.data.scenarios || this.data.scenarios.length < 20 || needsReseed) {
          this.data.scenarios = [...DETAILED_POOL_SCENARIOS];
          didUpdate = true;
        }
        if (didUpdate) {
          this.save();
        }
        if (!this.data.examAttempts) this.data.examAttempts = [];
        if (!this.data.auditLogs) this.data.auditLogs = [];
      } else {
        // Initialize with seeds
        this.data = {
          users: [
            {
              id: "admin_id",
              username: "admin",
              fullName: "Quản trị viên Hệ thống",
              role: "admin",
              department: "Sở Thông tin và Truyền thông",
              createdAt: new Date().toISOString()
            }
          ],
          passwords: {
            "admin": "admin123" // Default admin password
          },
          questions: [...DETAILED_POOL_QUESTIONS],
          scenarios: [...DETAILED_POOL_SCENARIOS],
          examAttempts: [],
          auditLogs: []
        };
        this.save();
      }
    } catch (e) {
      console.error("Database initialization failed, using in-memory model", e);
    }
  }

  private static save() {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error("Database save failed", e);
    }
  }

  // --- USER OPERATIONS ---
  public static getUsers(): User[] {
    return this.data.users;
  }

  public static getUserByUsername(username: string): User | undefined {
    return this.data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  public static getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public static updateUserDepartment(id: string, department: string): boolean {
    const user = this.getUserById(id);
    if (user) {
      user.department = department;
      this.save();
      return true;
    }
    return false;
  }

  public static authenticateUser(username: string, passport: string): User | null {
    const user = this.getUserByUsername(username);
    if (!user) return null;
    const storedPass = this.data.passwords[username.toLowerCase()];
    if (storedPass === passport) {
      return user;
    }
    return null;
  }

  public static registerUser(username: string, fullName: string, department: string, rawPassword: string): User {
    const existing = this.getUserByUsername(username);
    if (existing) {
      throw new Error("Tên tài khoản hoặc Số hiệu công chức đã được đăng ký.");
    }

    const newUser: User = {
      id: "u_" + Math.random().toString(36).substring(2, 11),
      username,
      fullName,
      role: 'user', // regular students by default
      department,
      createdAt: new Date().toISOString()
    };

    this.data.users.push(newUser);
    this.data.passwords[username.toLowerCase()] = rawPassword;
    this.save();
    return newUser;
  }

  // Passwordless register for Gmail Sign-On
  public static registerGmailUser(email: string, fullName: string, department: string): User {
    const existing = this.getUserByUsername(email);
    if (existing) {
      if (email.toLowerCase() === "pvantho@pdu.edu.vn" && existing.role !== 'superuser') {
        existing.role = 'superuser';
        this.save();
      }
      return existing;
    }

    const initialRole = (email.toLowerCase() === "pvantho@pdu.edu.vn") ? 'superuser' : 'user';

    const newUser: User = {
      id: "u_" + Math.random().toString(36).substring(2, 11),
      username: email.toLowerCase(),
      fullName,
      role: initialRole,
      department,
      createdAt: new Date().toISOString()
    };

    this.data.users.push(newUser);
    this.data.passwords[email.toLowerCase()] = "gmail_oauth_mock_pass_123";
    this.save();
    return newUser;
  }

  public static updateUserRole(id: string, role: 'admin' | 'user' | 'superuser' | 'manager', department?: string): boolean {
    const user = this.getUserById(id);
    if (user) {
      user.role = role;
      if (department) {
        user.department = department;
      }
      this.save();
      return true;
    }
    return false;
  }

  public static saveUser(user: User) {
    const idx = this.data.users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      this.data.users[idx] = user;
    } else {
      this.data.users.push(user);
    }
    this.save();
  }

  public static deleteUser(id: string) {
    this.data.users = this.data.users.filter(u => u.id !== id);
    // Remove attempts too if needed or keep for integrity. For simplicity, clean attempts.
    this.data.examAttempts = this.data.examAttempts.filter(att => att.userId !== id);
    this.data.auditLogs = this.data.auditLogs.filter(log => log.userId !== id);
    this.save();
  }

  public static resetAttempts(userId: string) {
    this.data.examAttempts = this.data.examAttempts.filter(att => att.userId === userId);
    this.save();
  }

  // --- QUESTION OPERATIONS ---
  public static getQuestions(): Question[] {
    return this.data.questions;
  }

  public static addQuestion(q: Question) {
    const exists = this.data.questions.some(item => item.id === q.id);
    if (!exists) {
      this.data.questions.push(q);
      this.save();
    }
  }

  public static updateQuestion(id: string, updated: Partial<Question>): boolean {
    const index = this.data.questions.findIndex(q => q.id === id);
    if (index >= 0) {
      this.data.questions[index] = { ...this.data.questions[index], ...updated } as Question;
      this.save();
      return true;
    }
    return false;
  }

  public static deleteQuestion(id: string): boolean {
    const origLength = this.data.questions.length;
    this.data.questions = this.data.questions.filter(q => q.id !== id);
    if (this.data.questions.length !== origLength) {
      this.save();
      return true;
    }
    return false;
  }

  public static getScenarios(): ScenarioQuestion[] {
    return this.data.scenarios;
  }

  public static addScenario(s: ScenarioQuestion) {
    const exists = this.data.scenarios.some(item => item.id === s.id);
    if (!exists) {
      this.data.scenarios.push(s);
      this.save();
    }
  }

  public static updateScenario(id: string, updated: Partial<ScenarioQuestion>): boolean {
    const index = this.data.scenarios.findIndex(s => s.id === id);
    if (index >= 0) {
      this.data.scenarios[index] = { ...this.data.scenarios[index], ...updated } as ScenarioQuestion;
      this.save();
      return true;
    }
    return false;
  }

  public static deleteScenario(id: string): boolean {
    const origLength = this.data.scenarios.length;
    this.data.scenarios = this.data.scenarios.filter(s => s.id !== id);
    if (this.data.scenarios.length !== origLength) {
      this.save();
      return true;
    }
    return false;
  }

  public static setQuestions(questions: Question[]) {
    this.data.questions = questions;
    this.save();
  }

  public static setScenarios(scenarios: ScenarioQuestion[]) {
    this.data.scenarios = scenarios;
    this.save();
  }

  // --- ATTEMPT WORKFLOWS ---
  public static getAttempts(): ExamAttempt[] {
    return this.data.examAttempts;
  }

  public static getAttemptsByUser(userId: string): ExamAttempt[] {
    return this.data.examAttempts.filter(att => att.userId === userId);
  }

  public static saveAttempt(attempt: ExamAttempt) {
    const index = this.data.examAttempts.findIndex(att => att.id === attempt.id);
    if (index >= 0) {
      this.data.examAttempts[index] = attempt;
    } else {
      this.data.examAttempts.push(attempt);
    }
    this.save();
  }

  // --- AUDIT LOGS ---
  public static getLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  public static logAction(userId: string, username: string, fullName: string, action: string, details: string, ip: string, browser: string) {
    const log: AuditLog = {
      id: "log_" + Math.random().toString(36).substring(2, 11),
      userId,
      username,
      fullName,
      action,
      details,
      ipAddress: ip || "unknown",
      browser: browser || "unknown",
      timestamp: new Date().toISOString()
    };
    this.data.auditLogs.push(log);
    this.save();
  }

  // --- SHUFFLE QUESTIONS & PREVENT OVERLAP (RULE: 2 consecutive runs max 30% overlap) ---
  public static generateExamPaper(userId: string): { questions: Question[]; scenarios: ScenarioQuestion[] } {
    const userAttempts = this.getAttemptsByUser(userId).filter(a => a.completedAt);
    const lastAttempt = userAttempts.length > 0 ? userAttempts[userAttempts.length - 1] : null;

    // Get the question ids that were in the last attempt
    const lastQuestionIds: string[] = [];
    const lastScenarioIds: string[] = [];
    if (lastAttempt && lastAttempt.gradedDetails) {
      lastAttempt.gradedDetails.partA.forEach(q => lastQuestionIds.push(q.questionId));
      lastAttempt.gradedDetails.partB.forEach(s => lastScenarioIds.push(s.scenarioId));
    }

    const allQuestions = this.data.questions;
    // Separate pools by difficulty
    const easyPool = allQuestions.filter(q => q.difficulty === 'easy');
    const mediumPool = allQuestions.filter(q => q.difficulty === 'medium');
    const hardPool = allQuestions.filter(q => q.difficulty === 'hard');

    // Select exactly 10 Easy MCQ
    const freshEasy = easyPool.filter(q => !lastQuestionIds.includes(q.id));
    const easyToUse = freshEasy.length >= 10 ? freshEasy : easyPool;
    const selectedEasy = this.shuffleArray([...easyToUse]).slice(0, 10);

    // Select exactly 5 Medium MCQ
    const freshMedium = mediumPool.filter(q => !lastQuestionIds.includes(q.id));
    const mediumToUse = freshMedium.length >= 5 ? freshMedium : mediumPool;
    const selectedMedium = this.shuffleArray([...mediumToUse]).slice(0, 5);

    // Select exactly 5 Hard MCQ
    const freshHard = hardPool.filter(q => !lastQuestionIds.includes(q.id));
    const hardToUse = freshHard.length >= 5 ? freshHard : hardPool;
    const selectedHard = this.shuffleArray([...hardToUse]).slice(0, 5);

    const finalQuestions = [...selectedEasy, ...selectedMedium, ...selectedHard];

    // Select exactly 5 scenario questions covering 5 distinct topics
    const allScenarios = this.data.scenarios;
    const topics = Array.from(new Set(allScenarios.map(s => s.topic)));
    
    const selectedScenarios: ScenarioQuestion[] = [];
    topics.forEach(topic => {
      const topicPool = allScenarios.filter(s => s.topic === topic);
      if (topicPool.length === 0) return;

      const freshScenarios = topicPool.filter(s => !lastScenarioIds.includes(s.id));
      const listToUse = freshScenarios.length > 0 ? freshScenarios : topicPool;
      const chosen = this.shuffleArray([...listToUse])[0];
      if (chosen && selectedScenarios.length < 5) {
        selectedScenarios.push(chosen);
      }
    });

    // Fit with additional scenarios from the general pool if less than 5 unique topics
    if (selectedScenarios.length < 5) {
      const remaining = allScenarios.filter(s => !selectedScenarios.some(sel => sel.id === s.id));
      const extra = this.shuffleArray([...remaining]).slice(0, 5 - selectedScenarios.length);
      selectedScenarios.push(...extra);
    }

    // Shuffle choices inside selected questions for individual session sheets
    const examQuestions = finalQuestions.map(q => {
      return {
        ...q,
        choices: this.shuffleArray([...q.choices])
      };
    });

    const examScenarios = selectedScenarios.map(s => {
      return {
        ...s,
        step1: { ...s.step1, choices: this.shuffleArray([...s.step1.choices]) },
        step2: { ...s.step2, choices: this.shuffleArray([...s.step2.choices]) },
        step3: { ...s.step3, choices: this.shuffleArray([...s.step3.choices]) }
      };
    });

    // Shuffle the final sequence of Part A so they don't appear sorted by difficulty
    return {
      questions: this.shuffleArray(examQuestions),
      scenarios: examScenarios
    };
  }

  private static shuffleArray<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
