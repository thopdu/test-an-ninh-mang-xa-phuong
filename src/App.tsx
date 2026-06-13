/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Building, BookmarkCheck, Check, X, Edit } from 'lucide-react';
import LoginRegisterCard from './components/LoginRegisterCard';
import DashboardView from './components/DashboardView';
import ExamRoomView from './components/ExamRoomView';
import ExamReviewView from './components/ExamReviewView';
import { User, ExamAttempt } from './types';

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Active view router: 'login' | 'dashboard' | 'exam' | 'review'
  const [view, setView] = useState<'login' | 'dashboard' | 'exam' | 'review'>('login');

  // Selected Dashboard Tab for the Sub-header Menu
  const [selectedTab, setSelectedTab] = useState<'individual' | 'global' | 'bank' | 'audit' | 'delegation'>('individual');

  // Exam state variables
  const [activeAttempt, setActiveAttempt] = useState<{
    id: string;
    attemptNumber: number;
    questions: any[];
    scenarios: any[];
    startedAt: string;
  } | null>(null);

  // Review state variables
  const [activeReviewData, setActiveReviewData] = useState<any | null>(null);

  // User Department editing inside top-right user header
  const [isEditingHeaderDept, setIsEditingHeaderDept] = useState(false);
  const [selectedHeaderDept, setSelectedHeaderDept] = useState('');
  const [updatingHeaderDept, setUpdatingHeaderDept] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setSelectedHeaderDept(user.department);
    }
  }, [user]);

  useEffect(() => {
    fetch('/api/departments')
      .then(res => res.json())
      .then(data => setDepartments(data || []))
      .catch(err => console.error("Could not load departments", err));
  }, []);

  const handleSaveHeaderDept = async () => {
    if (!selectedHeaderDept) {
      alert("Vui lòng chọn xã/phường công tác.");
      return;
    }
    setUpdatingHeaderDept(true);
    try {
      const response = await fetch('/api/auth/update-department', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ department: selectedHeaderDept })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gặp lỗi khi cập nhật.");
      }
      setUser(prev => prev ? { ...prev, department: selectedHeaderDept } : null);
      setIsEditingHeaderDept(false);
    } catch (err: any) {
      alert(err.message || "Gặp lỗi khi lưu đơn vị.");
    } finally {
      setUpdatingHeaderDept(false);
    }
  };

  // Validate session on load
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("Stale token");
          }
          return res.json();
        })
        .then(userData => {
          setUser(userData);
          setView('dashboard');
        })
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem('token');
          setToken(null);
          setView('login');
        })
        .finally(() => setLoading(false));
    } else {
      setView('login');
      setLoading(false);
    }
  }, [token]);

  const handleLoginSuccess = (newToken: string, loggedUser: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(loggedUser);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setView('login');
  };

  const handleStartExam = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/exam/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Gặp lỗi khi tạo đề thi.");
        return;
      }
      setActiveAttempt({
        id: data.attemptId,
        attemptNumber: data.attemptNumber,
        questions: data.questions,
        scenarios: data.scenarios,
        startedAt: data.startedAt
      });
      setView('exam');
    } catch {
      alert("Lỗi kết nối máy chủ khi sinh đề. Vui lòng thử lại!");
    }
  };

  const handleExamCompleted = (submitResult: any) => {
    // Save points and detailed results to pass directly to critique panel
    setActiveReviewData({
      score: submitResult.score,
      grade: submitResult.grade,
      gradedDetails: submitResult.gradedDetails,
      attemptNumber: activeAttempt?.attemptNumber || 1
    });
    setView('review');
  };

  const handleSelectReviewFromStats = (oldAttempt: ExamAttempt) => {
    setActiveReviewData({
      score: oldAttempt.score,
      grade: oldAttempt.gradedDetails ? (oldAttempt.score >= 95 ? "Xuất sắc" : oldAttempt.score >= 85 ? "Giỏi" : oldAttempt.score >= 70 ? "Khá" : oldAttempt.score >= 50 ? "Đạt" : "Chưa đạt") : "Chưa đạt",
      gradedDetails: oldAttempt.gradedDetails,
      attemptNumber: oldAttempt.attemptNumber
    });
    setView('review');
  };

  const handleUpdateUserDepartment = (newDept: string) => {
    if (user) {
      setUser({ ...user, department: newDept });
    }
  };

  const renderView = () => {
    if (loading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-16" id="loading-spinner-state">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-semibold font-sans">Đang đồng bộ mạng cục bộ...</span>
        </div>
      );
    }

    switch (view) {
      case 'login':
        return (
          <div className="flex-1 flex items-center justify-center py-8">
            <LoginRegisterCard onLoginSuccess={handleLoginSuccess} />
          </div>
        );
      case 'dashboard':
        return user ? (
          <DashboardView
            user={user}
            token={token || ''}
            onLogout={handleLogout}
            onStartExam={handleStartExam}
            onSelectReview={handleSelectReviewFromStats}
            onUpdateUserDepartment={handleUpdateUserDepartment}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ) : null;
      case 'exam':
        return activeAttempt && token ? (
          <ExamRoomView
            attemptId={activeAttempt.id}
            attemptNumber={activeAttempt.attemptNumber}
            questions={activeAttempt.questions}
            scenarios={activeAttempt.scenarios}
            startedAt={activeAttempt.startedAt}
            token={token}
            onExamSubmit={handleExamCompleted}
          />
        ) : null;
      case 'review':
        return activeReviewData && user ? (
          <ExamReviewView
            attemptData={activeReviewData}
            attemptNumber={activeReviewData.attemptNumber}
            userFullName={user.fullName}
            userDepartment={user.department}
            onBackToDashboard={() => setView('dashboard')}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-x-hidden" id="application-root">
      
      {/* Universal header for professional government branding */}
      <header className="bg-blue-800 text-white p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-lg sticky top-0 z-40 print:hidden animate-fade-in gap-3" id="main-header">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-md border border-slate-200 shrink-0">
            <img 
              src="/src/assets/images/app_logo_1781355779193.jpg" 
              alt="Logo An toàn thông tin" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black uppercase tracking-tight leading-tight">
              Trắc nghiệm kiến thức an toàn thông tin trên nền tảng số
            </h1>
            <p className="text-blue-105 text-[10px] sm:text-[11px] md:text-xs">
              Dành cho Cán bộ, Công chức cấp Xã/Phường
            </p>
          </div>
        </div>

        {user ? (
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto border-t border-blue-750/50 pt-2 sm:pt-0 sm:border-none">
            <div className="text-left sm:text-right">
              <div className="text-xs sm:text-sm font-bold tracking-tight">{user.fullName}</div>
              {isEditingHeaderDept ? (
                <div className="flex items-center gap-1 mt-0.5 justify-start sm:justify-end animate-fade-in">
                  <select
                    value={selectedHeaderDept}
                    onChange={(e) => setSelectedHeaderDept(e.target.value)}
                    className="text-[10px] px-1 py-0.5 bg-blue-900 border border-blue-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-400 max-w-[120px] sm:max-w-[150px] font-sans font-medium"
                    disabled={updatingHeaderDept}
                  >
                    <option value="">-- Chọn đơn vị --</option>
                    {departments.map((dep) => (
                      <option key={dep} value={dep} className="text-slate-800 bg-white font-sans font-medium">
                        {dep}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSaveHeaderDept}
                    disabled={updatingHeaderDept}
                    className="p-1 rounded bg-teal-500 hover:bg-teal-600 text-white cursor-pointer transition-colors"
                    title="Lưu"
                  >
                    <Check className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={() => setIsEditingHeaderDept(false)}
                    disabled={updatingHeaderDept}
                    className="p-1 rounded bg-blue-700 hover:bg-blue-600 text-white cursor-pointer transition-colors"
                    title="Hủy"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ) : (
                <div className="text-[10px] sm:text-[11px] text-blue-200 font-medium flex items-center justify-start sm:justify-end gap-1 mt-0.5 animate-fade-in">
                  <span className="font-sans font-medium">Đơn vị: <strong className="text-white font-bold">{user.department}</strong></span>
                  <button
                    onClick={() => {
                      setSelectedHeaderDept(user.department);
                      setIsEditingHeaderDept(true);
                    }}
                    className="text-yellow-400 hover:text-yellow-300 hover:underline inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold cursor-pointer ml-1 transition-colors"
                    title="Sửa thông tin đơn vị"
                  >
                    <Edit className="w-2.5 h-2.5 inline-block" /> Thay đổi
                  </button>
                </div>
              )}
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-700 rounded-md border border-blue-600 flex items-center justify-center shadow-sm shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1 bg-blue-700/50 px-3 py-1.5 rounded-lg text-blue-200 text-xs font-mono border border-blue-600/30">
            <span>An toàn thông tin v2026</span>
          </div>
        )}
      </header>

      {/* Sub-Header Navigation Menu - Nằm dưới sát Header */}
      {user && view === 'dashboard' && (
        <div className="bg-white border-b border-slate-200 shadow-sm sticky top-[80px] z-30 print:hidden" id="sub-header-menu">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2 gap-3">
              {/* Tabs list */}
              <nav className="flex flex-wrap items-center gap-1.5" aria-label="Sub Header Navigation Menu">
                <button
                  id="tab-btn-individual"
                  onClick={() => setSelectedTab('individual')}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-150 whitespace-nowrap ${
                    selectedTab === 'individual'
                      ? 'bg-blue-800 text-white shadow-sm font-extrabold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Cá nhân
                </button>

                {(user.role === 'admin' || user.role === 'superuser' || user.role === 'manager') && (
                  <button
                    id="tab-btn-global"
                    onClick={() => setSelectedTab('global')}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-150 whitespace-nowrap ${
                      selectedTab === 'global'
                        ? 'bg-blue-800 text-white shadow-sm font-extrabold'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                    }`}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
                    </svg>
                    Thống kê đơn vị
                  </button>
                )}

                {user.role === 'superuser' && (
                  <button
                    id="tab-btn-delegation"
                    onClick={() => setSelectedTab('delegation')}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-150 whitespace-nowrap ${
                      selectedTab === 'delegation'
                        ? 'bg-blue-800 text-white shadow-sm font-extrabold'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                    }`}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Phân quyền Gmail
                  </button>
                )}

                {(user.role === 'admin' || user.role === 'superuser') && (
                  <button
                    id="tab-btn-bank"
                    onClick={() => setSelectedTab('bank')}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-150 whitespace-nowrap ${
                      selectedTab === 'bank'
                        ? 'bg-blue-800 text-white shadow-sm font-extrabold'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                    }`}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Ngân hàng đề
                  </button>
                )}

                {(user.role === 'admin' || user.role === 'superuser' || user.role === 'manager') && (
                  <button
                    id="tab-btn-audit"
                    onClick={() => setSelectedTab('audit')}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-150 whitespace-nowrap ${
                      selectedTab === 'audit'
                        ? 'bg-blue-800 text-white shadow-sm font-extrabold'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                    }`}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Nhật ký sự cố
                  </button>
                )}
              </nav>

              {/* Auxiliary details and quick actions */}
              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 ml-auto md:ml-0">
                <div className="hidden md:flex items-center gap-1.5 bg-blue-50/70 py-1.5 px-3 rounded-lg border border-blue-105 text-[10.5px] text-blue-800 font-bold tracking-tight bg-slate-50/50">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shrink-0"></span>
                  VAI TRÒ: {user.role === 'superuser' ? 'SUPER USER' : user.role === 'manager' ? 'QUẢN LÝ ĐƠN VỊ' : user.role === 'admin' ? 'QUẢN TRỊ VIÊN' : 'CÁN BỘ SÁT HẠCH'}
                </div>
                <button
                  id="header-logout-btn"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-red-650 hover:text-red-700 bg-red-50/60 hover:bg-red-50 border border-red-100 text-xs font-extrabold cursor-pointer transition-all duration-150 whitespace-nowrap"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 flex flex-col py-6">
        {renderView()}
      </main>

      {/* Universal Footer Bar */}
      <footer className="bg-white border-t border-slate-200 px-8 py-4 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 font-medium gap-2 print:hidden" id="main-footer">
        <div>Hệ thống Kiểm tra & Khảo sát Trực tuyến © 2026</div>
      </footer>
    </div>
  );
}
