/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'user' | 'superuser' | 'manager';

export interface User {
  id: string;
  username: string; // Số hiệu công chức hoặc Tên đăng nhập
  fullName: string;
  role: UserRole;
  department: string; // Tên Xã, Phường, Thị trấn
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
}

export type QuestionCategory = 
  | 'law' // Quy luật, quy định pháp luật về an toàn thông tin
  | 'computer' // Sử dụng máy tính an toàn
  | 'phishing' // Nhận diện lừa đảo trực tuyến
  | 'account' // Quản lý tài khoản số
  | 'data'; // Quản lý dữ liệu số

export interface QuestionChoice {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  category: QuestionCategory;
  questionText: string;
  choices: QuestionChoice[];
  correctAnswerId: string; // ID of correct Choice
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

// Scenario Question Structure (Part B): Steps 1, 2, 3
export interface ScenarioStep {
  prompt: string;
  choices: QuestionChoice[];
  correctAnswerId: string;
}

export interface ScenarioQuestion {
  id: string;
  topic: string; // Phishing, Malware, USB, Email, etc.
  scenarioText: string;
  step1: ScenarioStep; // Xác định nguy cơ
  step2: ScenarioStep; // Chọn phương án xử lý
  step3: ScenarioStep; // Giải thích lý do
  explanation: string;
}

export interface ExamAttempt {
  id: string;
  userId: string;
  userFullName: string;
  userDepartment: string;
  attemptNumber: number; // 1 to 5
  startedAt: string;
  completedAt?: string;
  score: number; // 0 to 100
  timeSpentSeconds: number;
  browser: string;
  ipAddress: string;
  cheatWarningsCount: number; // Tab switching count, etc.
  answers: {
    partA: { [questionId: string]: string }; // questionId -> chosenChoiceId
    partB: { 
      [scenarioId: string]: {
        step1: string; // chosenChoiceId
        step2: string; // chosenChoiceId
        step3: string; // chosenChoiceId
      } 
    };
  };
  gradedDetails?: {
    partA: {
      questionId: string;
      questionText: string;
      chosenAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      points: number;
      explanation: string;
    }[];
    partB: {
      scenarioId: string;
      topic: string;
      scenarioText: string;
      step1: { prompt: string; chosen: string; correct: string; isCorrect: boolean; points: number };
      step2: { prompt: string; chosen: string; correct: string; isCorrect: boolean; points: number };
      step3: { prompt: string; chosen: string; correct: string; isCorrect: boolean; points: number };
      explanation: string;
      totalPoints: number; // max 8
    }[];
  };
}

export interface AuditLog {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  action: string; // e.g. "Đăng nhập", "Bắt đầu thi", "Tuyển tab cảnh báo", "Nộp bài"
  details: string;
  ipAddress: string;
  browser: string;
  timestamp: string;
}

export interface DashboardStats {
  individual: {
    hasMaxAttempts: boolean;
    remainingAttempts: number;
    highestScoreScore: number;
    highestScoreGrade: string;
    attempts: {
      attemptNumber: number;
      score: number;
      startedAt: string;
      timeSpent: number;
      grade: string;
    }[];
  };
  global: {
    totalRegistered: number;
    totalAttempted: number;
    totalNotAttempted: number;
    averageScore: number;
    passCount: number; // >= 50
    failCount: number; // < 50
    passRate: number; // percentage
    failRate: number; // percentage
    departmentStats: {
      name: string;
      totalUsers: number;
      attemptedUsers: number;
      averageScore: number;
      passRate: number;
    }[];
  };
}
