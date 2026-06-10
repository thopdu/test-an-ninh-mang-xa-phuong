/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, User, Award, ListCollapse, Play, RefreshCw, 
  BookOpen, Brain, Download, HelpCircle, ArrowRight, UserX, Trash, AlertTriangle, Activity,
  Search, Plus, Edit, X, Check
} from 'lucide-react';
import { User as UserType, ExamAttempt, DashboardStats, AuditLog, Question, ScenarioQuestion } from '../types';

interface DashboardViewProps {
  user: UserType;
  token: string;
  onLogout: () => void;
  onStartExam: () => void;
  onSelectReview: (attempt: ExamAttempt) => void;
  onUpdateUserDepartment?: (newDept: string) => void;
  selectedTab?: 'individual' | 'global' | 'bank' | 'audit' | 'delegation';
  setSelectedTab?: (tab: 'individual' | 'global' | 'bank' | 'audit' | 'delegation') => void;
}

export default function DashboardView({ 
  user, 
  token, 
  onLogout, 
  onStartExam, 
  onSelectReview, 
  onUpdateUserDepartment,
  selectedTab: propSelectedTab,
  setSelectedTab: propSetSelectedTab
}: DashboardViewProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [bankStats, setBankStats] = useState<{ choiceCount: number; scenarioCount: number } | null>(null);
  const [localSelectedTab, setLocalSelectedTab] = useState<'individual' | 'global' | 'bank' | 'audit' | 'delegation'>('individual');
  const selectedTab = propSelectedTab !== undefined ? propSelectedTab : localSelectedTab;
  const setSelectedTab = propSetSelectedTab !== undefined ? propSetSelectedTab : setLocalSelectedTab;
  const [searchQuery, setSearchQuery] = useState('');

  // Superuser states
  const [managers, setManagers] = useState<any[]>([]);
  const [newManagerEmail, setNewManagerEmail] = useState('');
  const [newManagerName, setNewManagerName] = useState('');
  const [newManagerDept, setNewManagerDept] = useState('');
  const [assigningLoading, setAssigningLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const [aiMessage, setAiMessage] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // User Department Inline Edit States
  const [departments, setDepartments] = useState<string[]>([]);
  const [isEditingDept, setIsEditingDept] = useState(false);
  const [selectedDept, setSelectedDept] = useState(user.department);
  const [updatingDept, setUpdatingDept] = useState(false);

  // Dynamic set of selected department when user prop shifts (e.g. state refreshes)
  useEffect(() => {
    setSelectedDept(user.department);
  }, [user.department]);

  // Question bank state variables
  const [questions, setQuestions] = useState<Question[]>([]);
  const [scenarios, setScenarios] = useState<ScenarioQuestion[]>([]);
  const [bankTab, setBankTab] = useState<'mcq' | 'scenario'>('mcq');

  // Filter & search states for bank
  const [mcqCategoryFilter, setMcqCategoryFilter] = useState<string>('all');
  const [mcqDifficultyFilter, setMcqDifficultyFilter] = useState<string>('all');
  const [mcqSearchText, setMcqSearchText] = useState<string>('');
  
  const [sceSearchText, setSceSearchText] = useState<string>('');

  // Editing structures
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAddingNewMCQ, setIsAddingNewMCQ] = useState<boolean>(false);
  const [mcqInputMode, setMcqInputMode] = useState<'form' | 'json'>('form');
  const [jsonImportText, setJsonImportText] = useState<string>('');
  const [editingScenario, setEditingScenario] = useState<ScenarioQuestion | null>(null);
  const [isAddingNewScenario, setIsAddingNewScenario] = useState<boolean>(false);

  // Custom notifications and alerts (bypasses prompt blocks in iframes)
  const [notifyMsg, setNotifyMsg] = useState<string | null>(null);
  const [notifyType, setNotifyType] = useState<'success' | 'error' | 'info'>('info');
  const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);
  
  // Rebuild bank states
  const [rebuildProgress, setRebuildProgress] = useState<{ step: number; log: string; error?: string } | null>(null);

  const triggerAlert = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotifyMsg(msg);
    setNotifyType(type);
    setTimeout(() => {
      setNotifyMsg(prev => prev === msg ? null : prev);
    }, 4500);
  };

  // Load stats and related information
  useEffect(() => {
    // Load departments
    fetch('/api/departments')
      .then(res => res.json())
      .then(data => setDepartments(data || []))
      .catch(err => console.error("Could not load departments", err));

    // Current user individual stats
    fetch('/api/admin/dashboard-stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Could not fetch stats", err));

    // Multi-role fetching
    const isAdminOrSuperOrManager = user.role === 'admin' || user.role === 'superuser' || user.role === 'manager';
    const isAdminOrSuper = user.role === 'admin' || user.role === 'superuser';

    if (isAdminOrSuperOrManager) {
      fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setAdminUsers(data || []))
        .catch(err => console.error("Could not fetch users", err));

      fetch('/api/admin/audit-logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setAuditLogs(data || []))
        .catch(err => console.error("Could not fetch logs", err));
    }

    if (isAdminOrSuper) {
      fetch('/api/admin/questions-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setBankStats({ choiceCount: data.choiceCount || 0, scenarioCount: data.scenarioCount || 0 });
          setQuestions(data.questions || []);
          setScenarios(data.scenarios || []);
        })
        .catch(err => console.error("Could not fetch bank counts", err));
    }

    if (user.role === 'superuser') {
      fetch('/api/superuser/managers', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setManagers(data || []))
        .catch(err => console.error("Could not fetch managers", err));
    }
  }, [token, user.role, refreshTrigger]);

  const handleSaveUserDepartment = async () => {
    if (!selectedDept) {
      alert("Vui lòng chọn xã/phường công tác.");
      return;
    }
    setUpdatingDept(true);
    try {
      const response = await fetch('/api/auth/update-department', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ department: selectedDept })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gặp lỗi cập nhật xã/phường.');
      }
      if (onUpdateUserDepartment) {
        onUpdateUserDepartment(selectedDept);
      }
      setIsEditingDept(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      triggerAlert(err.message, "error");
    } finally {
      setUpdatingDept(false);
    }
  };

  const handleResetAttempts = async (userId: string) => {
    setConfirmModal({
      message: "Đồng chí có chắc chắn muốn xóa toàn bộ lịch sử và đặt lại số lượt sát hạch của học viên này về 0?",
      onConfirm: async () => {
        try {
          const res = await fetch('/api/admin/users/reset-attempts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId })
          });
          if (res.ok) {
            triggerAlert("Đã đặt lại số lượt thi thành công!", "success");
            setRefreshTrigger(prev => prev + 1);
          } else {
            const d = await res.json();
            triggerAlert(d.error || "Gặp sự cố khi đặt lại.", "error");
          }
        } catch {
          triggerAlert("Lỗi kết nối máy chủ.", "error");
        }
      }
    });
  };

  const handleGenerateAI = async (type: "choice" | "scenario") => {
    setLoadingAI(type);
    setAiMessage("");
    try {
      const res = await fetch('/api/admin/generate-questions-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gặp lỗi khi triệu hồi Gemini API.");
      }
      setAiMessage(data.message || "Sinh câu hỏi thành công!");
      setRefreshTrigger(prev => prev + 1);
      triggerAlert(data.message || "Sinh câu hỏi thành công!", "success");
    } catch (err: any) {
      triggerAlert(err.message, "error");
    } finally {
      setLoadingAI(null);
    }
  };

  const handleExecuteAIRebuild = async () => {
    setRebuildProgress({ step: 1, log: "Bắt đầu liên hệ Gemini AI để khởi tạo ngân hàng kiểm tra chuyên nghiệp mới..." });
    const stepLogs = [
      "", // placeholder
      "Đang sinh và cấu trúc 20 câu hỏi về Chuyên đề Pháp luật & Luật An ninh mạng (0%-20%)...",
      "Đang sinh và cấu trúc 20 câu hỏi về Chuyên đề Sử dụng máy tính công sở an toàn (20%-40%)...",
      "Đang sinh và cấu trúc 20 câu hỏi về Chuyên đề Nhận diện lừa đảo trực tuyến (40%-60%)...",
      "Đang sinh và cấu trúc 20 câu hỏi về Chuyên đề Bảo mật mật khẩu & Tài khoản số (60%-80%)...",
      "Đang sinh và cấu trúc 20 câu hỏi về Chuyên đề Sao lưu & Bảo vệ dữ liệu hành chính (80%-100%)...",
      "Đang sinh 10 kịch bản tình huống thực tế mô phỏng trực quan 3 bước..."
    ];

    try {
      for (let s = 1; s <= 6; s++) {
        setRebuildProgress({ step: s, log: stepLogs[s] });
        const res = await fetch('/api/admin/rebuild-bank-ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ step: s })
        });
        const d = await res.json();
        if (!res.ok) {
          throw new Error(d.error || `Lỗi tại bước ${s}`);
        }
      }
      
      setRebuildProgress({ step: 7, log: "Đang đồng bộ và chuẩn bị ngân hàng đề để sát hạch..." });
      setTimeout(() => {
        setRebuildProgress(null);
        setRefreshTrigger(prev => prev + 1);
        triggerAlert("Tái lập thành công toàn diện: 100 Câu trắc nghiệm & 10 Kịch bản tình huống hoàn toàn bằng AI!", "success");
      }, 1500);

    } catch (err: any) {
      setRebuildProgress(prev => ({ step: prev?.step || 1, log: prev?.log || "", error: err.message }));
    }
  };

  // --- ACTIONS FOR MCQ AND SCENARIO MANAGEMENT ---

  const handleEditMCQClick = (q: Question) => {
    setEditingQuestion({ ...q });
    setIsAddingNewMCQ(false);
  };

  const handleCreateMCQClick = () => {
    setMcqInputMode('form');
    setJsonImportText(`[\n  {\n    "id": 100,\n    "topic": "dulieu",\n    "text": "Tại sao không nên sao lưu dữ liệu mật lên Google Drive cá nhân, Zalo hay ổ đĩa cá nhân?",\n    "opts": [\n      "A. Tốc độ tải lên quá chậm",\n      "B. Vi phạm quy định bảo mật, dễ bị rò rỉ ra ngoài phạm vi kiểm soát của cơ quan",\n      "C. Dung lượng không đủ",\n      "D. Tốn chi phí lưu trữ"\n    ],\n    "ans": 1\n  }\n]`);
    setEditingQuestion({
      id: '',
      category: 'law',
      questionText: '',
      choices: [
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' }
      ],
      correctAnswerId: 'A',
      difficulty: 'easy',
      explanation: ''
    });
    setIsAddingNewMCQ(true);
  };

  const handleSaveMCQSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    if (isAddingNewMCQ && mcqInputMode === 'json') {
      try {
        let parsedJSON;
        try {
          parsedJSON = JSON.parse(jsonImportText);
        } catch (jsonErr: any) {
          throw new Error("Cú pháp JSON chưa đúng định dạng. Đồng chí vui lòng kiểm tra lại cấu trúc đóng mở ngoặc [] hoặc dấu phẩy.");
        }

        const res = await fetch('/api/admin/questions/import-json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ questions: parsedJSON })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Gặp lỗi nạp câu hỏi.");
        }
        triggerAlert(data.message || "Nhập câu hỏi thành công!", "success");
        setEditingQuestion(null);
        setIsAddingNewMCQ(false);
        setRefreshTrigger(prev => prev + 1);
      } catch (err: any) {
        triggerAlert(err.message, "error");
      }
      return;
    }

    if (!editingQuestion.questionText.trim()) {
      triggerAlert("Vui lòng điền nội dung câu hỏi.", "error");
      return;
    }

    const endpoint = isAddingNewMCQ ? '/api/admin/questions/add' : '/api/admin/questions/edit';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingQuestion)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gặp lỗi lưu câu hỏi.");
      }
      triggerAlert(data.message || "Lưu câu hỏi thành công!", "success");
      setEditingQuestion(null);
      setIsAddingNewMCQ(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      triggerAlert(err.message, "error");
    }
  };

  const handleDeleteMCQClick = async (id: string) => {
    setConfirmModal({
      message: "Đồng chí có chắc chắn muốn xóa hẳn câu hỏi trắc nghiệm này khỏi ngân hàng câu hỏi đề cốt lõi?",
      onConfirm: async () => {
        try {
          const res = await fetch('/api/admin/questions/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id })
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || "Gặp lỗi khi xóa.");
          }
          triggerAlert(data.message || "Xóa câu hỏi thành công!", "success");
          setRefreshTrigger(prev => prev + 1);
        } catch (err: any) {
          triggerAlert(err.message, "error");
        }
      }
    });
  };

  const handleClearAllMCQQuestions = () => {
    setConfirmModal({
      message: "⚠️ CẢNH BÁO KHẨN CẤP: Hành động này sẽ xóa TOÀN BỘ câu hỏi trắc nghiệm hiện đang có trong ngân hàng đề. Hệ thống sẽ ở trạng thái trống đề cho đến khi đồng chí nạp hoặc import file JSON mới. Đồng chí chắc chắn muốn tiến hành?",
      onConfirm: async () => {
        try {
          const res = await fetch('/api/admin/questions/clear-all', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || "Gặp lỗi khi xóa.");
          }
          triggerAlert(data.message || "Xóa toàn bộ câu hỏi trắc nghiệm thành công!", "success");
          setRefreshTrigger(prev => prev + 1);
        } catch (err: any) {
          triggerAlert(err.message, "error");
        }
      }
    });
  };

  const handleClearAllScenarioQuestions = () => {
    setConfirmModal({
      message: "⚠️ CẢNH BÁO KHẨN CẤP: Hành động này sẽ xóa TOÀN BỘ câu hỏi tình huống 3 bước hiện đang có trong ngân hàng đề. Đồng chí chắc chắn muốn tiến hành?",
      onConfirm: async () => {
        try {
          const res = await fetch('/api/admin/scenarios/clear-all', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || "Gặp lỗi khi xóa.");
          }
          triggerAlert(data.message || "Xóa toàn bộ câu hỏi tình huống thành công!", "success");
          setRefreshTrigger(prev => prev + 1);
        } catch (err: any) {
          triggerAlert(err.message, "error");
        }
      }
    });
  };

  // Scenarios
  const handleEditScenarioClick = (s: ScenarioQuestion) => {
    setEditingScenario({ ...s });
    setIsAddingNewScenario(false);
  };

  const handleCreateScenarioClick = () => {
    setEditingScenario({
      id: '',
      topic: 'Email giả mạo',
      scenarioText: '',
      step1: {
        prompt: 'Xác định nguy cơ trong tình huống trên',
        choices: [
          { id: 'A', text: '' },
          { id: 'B', text: '' },
          { id: 'C', text: '' },
          { id: 'D', text: '' }
        ],
        correctAnswerId: 'A'
      },
      step2: {
        prompt: 'Quy trình xử lý an toàn thông tin tối ưu là gì?',
        choices: [
          { id: 'A', text: '' },
          { id: 'B', text: '' },
          { id: 'C', text: '' },
          { id: 'D', text: '' }
        ],
        correctAnswerId: 'A'
      },
      step3: {
        prompt: 'Ý nghĩa hành vi phòng thủ này là gì?',
        choices: [
          { id: 'A', text: '' },
          { id: 'B', text: '' },
          { id: 'C', text: '' },
          { id: 'D', text: '' }
        ],
        correctAnswerId: 'A'
      },
      explanation: ''
    });
    setIsAddingNewScenario(true);
  };

  const handleSaveScenarioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScenario) return;

    if (!editingScenario.scenarioText.trim() || !editingScenario.topic.trim()) {
      triggerAlert("Vui lòng điền bối cảnh kịch bản tình huống.", "error");
      return;
    }

    const endpoint = isAddingNewScenario ? '/api/admin/scenarios/add' : '/api/admin/scenarios/edit';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingScenario)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gặp lỗi lưu tình huống.");
      }
      triggerAlert(data.message || "Lưu tình huống thành công!", "success");
      setEditingScenario(null);
      setIsAddingNewScenario(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      triggerAlert(err.message, "error");
    }
  };

  const handleDeleteScenarioClick = async (id: string) => {
    setConfirmModal({
      message: "Đồng chí có chắc chắn muốn xóa đi kịch bản tình huống thực tế này?",
      onConfirm: async () => {
        try {
          const res = await fetch('/api/admin/scenarios/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id })
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || "Gặp lỗi khi xóa.");
          }
          triggerAlert(data.message || "Xóa tình huống thành công!", "success");
          setRefreshTrigger(prev => prev + 1);
        } catch (err: any) {
          triggerAlert(err.message, "error");
        }
      }
    });
  };

  const exportCSV = () => {
    if (!adminUsers || adminUsers.length === 0) return;
    
    let csvContent = "\ufeff"; // BOM for UTF-8 Excel support
    csvContent += "Họ và tên,Tên đăng nhập,Đơn vị,Lượt thi đã thực hiện\n";
    
    adminUsers.forEach(u => {
      csvContent += `"${u.fullName}","${u.username}","${u.department}",${u.attemptsCount}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bao_cao_sat_hach_an_toan_tt_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs} giây`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('vi-VN');
  };

  const levelColor = (grade: string) => {
    switch (grade) {
      case "Xuất sắc": return "bg-emerald-500 text-white";
      case "Giỏi": return "bg-teal-500 text-white";
      case "Khá": return "bg-blue-500 text-white";
      case "Đạt": return "bg-amber-500 text-white";
      default: return "bg-red-500 text-white";
    }
  };

  const progressStyle = (rate: number) => {
    return { width: `${rate}%` };
  };

  const filteredUsers = adminUsers.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6" id="dashboard-container">

      {/* INDIVIDUAL EXAM PANEL */}
      {selectedTab === 'individual' && stats && (
        <div className="space-y-6" id="individual-panel">
          
          {/* Main Grid Layout to match Design HTML */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Sidebar Columns - 1 col width on large screens */}
            <div className="space-y-6 lg:col-span-1">
              
              {/* Card: Kết quả cao nhất */}
              <div className="bg-gradient-to-b from-amber-50 to-emerald-50/20 border-2 border-amber-400/80 rounded-2xl p-6 shadow-md text-center flex flex-col items-center transform hover:scale-[1.01] transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400"></div>
                
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-black rounded-full uppercase tracking-widest animate-pulse mb-3 select-none">
                  🥇 KHẢO SÁT ƯU TÚ
                </div>

                <h2 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-4 flex items-center gap-1.5 self-center">
                  <Award className="w-5 h-5 text-amber-500 shrink-0" />
                  KẾT QUẢ CAO NHẤT
                </h2>
                
                {stats.individual.attempts.length > 0 ? (
                  <div className="flex flex-col items-center">
                    {/* SVG Circular score */}
                    <div className="relative flex items-center justify-center">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="54" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-amber-100/55"></circle>
                        <circle 
                          cx="64" 
                          cy="64" 
                          r="54" 
                          stroke="currentColor" 
                          strokeWidth="8" 
                          fill="transparent" 
                          strokeDasharray="339.3" 
                          strokeDashoffset={339.3 - (Math.min(100, Math.max(0, stats.individual.highestScoreScore || 0)) / 100) * 339.3} 
                          className="text-emerald-500 transition-all duration-1000 ease-out"
                        ></circle>
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold text-slate-850 font-sans tracking-tight">
                          {stats.individual.highestScoreScore}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Điểm tối đa</span>
                      </div>
                    </div>
                    
                    {/* Classification Grade */}
                    <div className="mt-5 text-xs font-semibold text-slate-700 flex flex-col items-center gap-1.5">
                      <span>Xếp loại tốt nhất của đồng chí:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider select-none shadow-xs border ${
                        stats.individual.highestScoreScore >= 90 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        stats.individual.highestScoreScore >= 80 ? 'bg-teal-100 text-teal-800 border-teal-300' :
                        stats.individual.highestScoreScore >= 65 ? 'bg-blue-100 text-blue-850 border-blue-300' :
                        stats.individual.highestScoreScore >= 50 ? 'bg-amber-100 text-amber-800 border-amber-300' :
                        'bg-red-100 text-red-800 border-red-350'
                      }`}>
                        {stats.individual.highestScoreGrade}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-dashed border-slate-200 text-slate-300 mb-3">
                      <Award className="w-8 h-8" />
                    </div>
                    <span className="text-xs text-slate-400 italic">Đồng chí chưa thi lượt nào</span>
                  </div>
                )}
              </div>

              {/* Card: Trạng thái dự thi */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Trạng thái dự thi
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                      <span>Số lần đã thi:</span>
                      <span>{5 - stats.individual.remainingAttempts} / 05 lần</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${(5 - stats.individual.remainingAttempts) * 20}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs font-semibold text-slate-600 pt-3 border-t border-slate-100">
                    <span>Số lần còn lại:</span>
                    <span className="text-blue-700 font-extrabold">{stats.individual.remainingAttempts} lượt</span>
                  </div>

                  {/* Immediate Action CTA */}
                  <div className="pt-2">
                    {stats.individual.remainingAttempts > 0 ? (
                      <button
                        onClick={onStartExam}
                        className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer select-none uppercase tracking-wider"
                      >
                        <Play className="w-4 h-4 fill-current shrink-0" />
                        Bắt đầu lượt thi thứ {6 - stats.individual.remainingAttempts}
                      </button>
                    ) : (
                      <div className="w-full text-center py-3 px-4 bg-red-50 border border-red-100 text-red-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
                        <ShieldAlert className="w-4.5 h-4.5 text-red-500 shrink-0" />
                        Hoàn thành đủ 5 lượt thi!
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Main Columns - 2 col width on large screens */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Card: Lịch sử làm bài sát hạch */}
              <div className="bg-white border-2 border-emerald-500/35 rounded-2xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-550 to-blue-550"></div>
                <div>
                  <h2 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-4 border-b border-emerald-100 pb-2.5 flex items-center gap-1.5">
                    <ListCollapse className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    NHẬT KÝ SÁT HẠCH CÁ NHÂN LIÊN TIẾP
                  </h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] text-slate-500 uppercase font-bold tracking-wider border-b border-slate-200">
                          <th className="px-4 py-3">Lần thi</th>
                          <th className="px-4 py-3">Thời gian thực hiện</th>
                          <th className="px-4 py-3 text-right">Điểm số</th>
                          <th className="px-4 py-3 text-center">Xếp loại</th>
                          <th className="px-4 py-3 text-center">Chi tiết</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {stats.individual.attempts.length > 0 ? (
                          (() => {
                            const maxScoreVal = Math.max(...stats.individual.attempts.map(a => a.score));
                            return stats.individual.attempts.map((att, idx) => {
                              const isHighest = att.score === maxScoreVal;
                              return (
                                <tr 
                                  key={idx} 
                                  className={`transition-colors ${isHighest ? 'bg-amber-50/70 hover:bg-amber-100/60 font-semibold border-l-4 border-l-amber-500' : 'hover:bg-slate-50/50'}`}
                                >
                                  <td className="px-4 py-3.5 font-extrabold text-slate-800">
                                    <div className="flex items-center gap-1.5">
                                      <span>Lần {att.attemptNumber}</span>
                                      {isHighest && (
                                        <span className="inline-flex items-center gap-0.5 bg-amber-100 border border-amber-300 text-amber-800 text-[8px] font-black px-1.5 py-0.5 rounded-full select-none uppercase tracking-wider">
                                          ⭐ CAO NHẤT
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3.5 text-slate-500 font-medium">
                                    <div className="font-semibold text-slate-700">{formatDate(att.startedAt)}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">Thời lượng: {formatTime(att.timeSpent)}</div>
                                  </td>
                                  <td className="px-4 py-3.5 text-right font-extrabold text-slate-900 font-mono text-sm">
                                    {att.score} <span className="text-[10px] text-slate-400">đ/100</span>
                                  </td>
                                  <td className="px-4 py-3.5 text-center">
                                    <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                      att.score >= 90 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                      att.score >= 80 ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                                      att.score >= 65 ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                      att.score >= 50 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                      'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                      {att.score >= 90 ? 'Xuất sắc' :
                                       att.score >= 80 ? 'Giỏi' :
                                       att.score >= 65 ? 'Khá' :
                                       att.score >= 50 ? 'Đạt' : 'Chưa đạt'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3.5 text-center">
                                    <button
                                      onClick={() => {
                                        fetch('/api/exam/attempts', {
                                          headers: { 'Authorization': `Bearer ${token}` }
                                        })
                                          .then(res => res.json())
                                          .then(list => {
                                            const fullObj = list.find((a: any) => a.attemptNumber === att.attemptNumber);
                                            if (fullObj) onSelectReview(fullObj);
                                          });
                                      }}
                                      className="p-1 px-2.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100 hover:bg-blue-100 hover:text-blue-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
                                      title="Xem đáp án và bài học sâu sắc"
                                    >
                                      Tra cứu <ArrowRight className="w-3 h-3" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            });
                          })()
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-10 text-center text-slate-400 italic font-medium">
                              Đồng chí chưa khởi chạy lượt sát hạch nào. Dữ liệu ghi nhận trống.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Quy định sát hạch chuyên đề */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <BookOpen className="w-4.5 h-4.5 text-blue-700 shrink-0" />
                  Quy chế Sát hạch Chuyên đề
                </h2>
                <div className="text-xs text-slate-650 space-y-3 font-normal leading-relaxed">
                  <p className="font-semibold text-slate-800 text-sm">
                    Các đồng chí được thực hiện sát hạch 5 lần và lấy điểm lần cao nhất
                  </p>
                </div>
              </div>

              {/* Alert Warning baner - Professional Polish Bottom Alert */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-4 animate-fade-in shadow-xs">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-200 shadow-xs">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Lưu ý thi an toàn mạng hành chính:</h4>
                  <p className="text-[11px] text-blue-700 mt-1 leading-relaxed">
                    Đồng chí tuyệt đối không chuyển đổi sang các tab khác hoặc thu nhỏ trình duyệt trong suốt hành trình 30 phút kiểm tra. Toàn bộ hành vi chuyển màn hình (Tab switching) sẽ được hệ thống phân tích nhật ký Audit Log tự động ghi lại phục vụ công tác thanh tra.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ADMIN GLOBAL STATISTICS */}
      {selectedTab === 'global' && stats?.global && (
        <div className="space-y-6" id="global-stats-panel">
          {/* Bento boxes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center">
              <span className="text-xs text-slate-400 block font-normal">Tổng nhân sự đã đăng ký</span>
              <span className="text-2xl font-extrabold text-slate-800 font-sans block mt-1">{stats.global.totalRegistered}</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center">
              <span className="text-xs text-slate-400 block font-normal">Đã tham gia sát hạch</span>
              <span className="text-2xl font-extrabold text-blue-600 font-sans block mt-1">
                {stats.global.totalAttempted} 
                <span className="text-xs text-slate-400 font-normal"> ({Math.round((stats.global.totalAttempted / (stats.global.totalRegistered || 1)) * 100)}%)</span>
              </span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center">
              <span className="text-xs text-slate-400 block font-normal">Điểm trung bình các cán bộ</span>
              <span className="text-2xl font-extrabold text-slate-800 font-sans block mt-1 text-emerald-600">{stats.global.averageScore} đ</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center relative overflow-hidden">
              <span className="text-xs text-slate-400 block font-normal">Tỉ lệ Đạt chuẩn (&ge; 50đ)</span>
              <span className="text-2xl font-extrabold text-amber-600 font-sans block mt-1">{stats.global.passRate}%</span>
              <div className="absolute bottom-0 left-0 h-1 bg-amber-500" style={progressStyle(stats.global.passRate)}></div>
            </div>
          </div>

          {/* Breakdown & Export and users search table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-2">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  Danh sách Cán bộ & Kết quả hoạt động
                </h3>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    className="text-xs px-2.5 py-1.5 border border-slate-200 rounded bg-slate-50 focus:outline-none w-full sm:w-44"
                    placeholder="Tìm kiếm họ tên, xã..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <button
                    onClick={exportCSV}
                    className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs gap-1 flex items-center cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Báo cáo Excel
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <th className="p-2.5">Họ tên cán bộ</th>
                      <th className="p-2.5">Xã, Phường</th>
                      <th className="p-2.5 text-center">Số lần thi</th>
                      <th className="p-2.5 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((u, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-bold text-slate-800">
                            {u.fullName}
                            <span className="block text-[10px] text-slate-400 font-mono italic">TK: {u.username}</span>
                          </td>
                          <td className="p-2.5 text-slate-600">{u.department}</td>
                          <td className="p-2.5 text-center font-bold text-slate-700">{u.attemptsCount} / 5</td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => handleResetAttempts(u.id)}
                              className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-[10px] font-semibold border border-red-100 cursor-pointer duration-100"
                              title="Reset lượt thi học viên về 0"
                            >
                              Reset thi
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400 italic">Không tìm thấy cán bộ phù hợp.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Department statistics layout */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 mb-4">
                Chỉ số An toàn theo Xã/Phường
              </h3>
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                {stats.global.departmentStats.map((dep, idx) => (
                  <div key={idx} className="border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between text-xs mb-1.1">
                      <span className="font-bold text-slate-700 truncate max-w-[200px]">{dep.name}</span>
                      <span className="text-[10px] text-slate-400">{dep.attemptedUsers}/{dep.totalUsers} người</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="bg-blue-600 h-full" style={{ width: `${dep.passRate}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>Tỉ lệ đạt: <strong className="text-slate-600 font-sans">{dep.passRate}%</strong></span>
                      <span>Điểm TB: <strong className="text-slate-600 font-sans">{dep.averageScore} đ</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI DATABASE OPTIMIZATION PANEL */}
      {selectedTab === 'bank' && (user.role === 'admin' || user.role === 'superuser') && (
        <div className="space-y-6" id="ai-bank-panel">
          {/* Progress Overlay for AI core Rebuild Wizard */}
          {rebuildProgress && (
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" id="rebuild-progress-modal">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-lg w-full text-center space-y-6 shadow-2xl relative">
                <div className="w-16 h-16 bg-blue-100 border border-blue-200 text-blue-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Brain className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-tight">
                    QUÁ TRÌNH TÁI THIẾT LẬP NGÂN HÀNG LÕI 100% QUA AI GOOGLE GEMINI
                  </h3>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl max-h-24 overflow-y-auto text-[11px] font-mono text-slate-600 leading-normal">
                    {rebuildProgress.log}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>TIẾN TRÌNH THỰC HIỆN</span>
                    <span>{rebuildProgress.step * 16 > 100 ? 100 : Math.round(rebuildProgress.step * 16.6)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden border border-slate-200">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out animate-pulse"
                      style={{ width: `${rebuildProgress.step * 16.6}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Bước {rebuildProgress.step} trên tổng số 6 bước chính
                  </div>
                </div>

                {rebuildProgress.error ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 border border-red-150 text-red-850 text-xs rounded-xl text-left font-medium leading-relaxed">
                      Lỗi quy trình: {rebuildProgress.error}
                    </div>
                    <button
                      onClick={() => setRebuildProgress(null)}
                      className="w-full py-2 bg-red-600 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Đóng và kiểm thử lại sau
                    </button>
                  </div>
                ) : (
                  <p className="text-[10px] text-amber-600 font-semibold italic animate-bounce select-none">
                    ⚠️ Tuyệt đối không tắt màn hình hay đóng trình duyệt lúc này!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* MAIN BANK VIEWER COMPONENT */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b border-slate-100 gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-700" />
                  HỆ THỐNG QUẢN LÝ NGÂN HÀNG CÂU HỎI QUỐC GIA
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Bộ lọc và cấu trúc tùy chỉnh phục vụ thanh tra, kiểm tra chuyên môn
                </p>
              </div>

              {/* Bank view switches */}
              <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                <button
                  onClick={() => setBankTab('mcq')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all duration-100 ${bankTab === 'mcq' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Trắc nghiệm ({questions.length})
                </button>
                <button
                  onClick={() => setBankTab('scenario')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all duration-100 ${bankTab === 'scenario' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Tình huống ({scenarios.length})
                </button>
              </div>
            </div>

            {/* MCQ SECTION INSIDE BANK TAB */}
            {bankTab === 'mcq' && (
              <div className="space-y-4">
                {/* MCQ Filters header row */}
                <div className="flex flex-col lg:flex-row lg:items-end gap-3 bg-slate-50 p-4 rounded-xl border border-slate-150">
                  <div className="w-full lg:w-[28%]">
                    <label className="block text-[9px] font-extrabold uppercase text-slate-400 tracking-wider mb-1">
                      Chuyên đề / Danh mục
                    </label>
                    <select
                      value={mcqCategoryFilter}
                      onChange={(e) => setMcqCategoryFilter(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-700 outline-none h-[34px]"
                    >
                      <option value="all">-- Tất cả chuyên đề --</option>
                      <option value="law">Quy định pháp luật số</option>
                      <option value="computer">Sử dụng máy tính an toàn</option>
                      <option value="phishing">Nhận diện lừa đảo trực tuyến</option>
                      <option value="account">Quản lý tài khoản bảo mật</option>
                      <option value="data">Bảo vệ và Quản lý dữ liệu</option>
                    </select>
                  </div>

                  <div className="w-full lg:w-[20%]">
                    <label className="block text-[9px] font-extrabold uppercase text-slate-400 tracking-wider mb-1">
                      Cấp độ khó
                    </label>
                    <select
                      value={mcqDifficultyFilter}
                      onChange={(e) => setMcqDifficultyFilter(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-150 rounded-lg text-slate-700 outline-none h-[34px]"
                    >
                      <option value="all">-- Tất cả độ khó --</option>
                      <option value="easy">Cơ bản (Dễ)</option>
                      <option value="medium">Trung cấp (Trung bình)</option>
                      <option value="hard">Chuyên sâu (Khó)</option>
                    </select>
                  </div>

                  <div className="w-full lg:w-[35%]">
                    <label className="block text-[9px] font-extrabold uppercase text-slate-400 tracking-wider mb-1">
                      Tìm kiếm nội dung
                    </label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm nội dung câu đố..."
                        value={mcqSearchText}
                        onChange={(e) => setMcqSearchText(e.target.value)}
                        className="w-full text-xs p-2 pl-9 bg-white border border-slate-200 rounded-lg text-slate-700 outline-none h-[34px]"
                      />
                    </div>
                  </div>

                  <div className="w-full lg:flex-grow lg:w-auto flex items-center gap-2">
                    <button
                      onClick={handleCreateMCQClick}
                      className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 h-[34px] cursor-pointer shadow-sm whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm mới
                    </button>
                    <button
                      onClick={handleClearAllMCQQuestions}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 h-[34px] cursor-pointer shadow-sm whitespace-nowrap transition-colors"
                      title="Xóa toàn bộ câu hỏi trắc nghiệm trực quan trong hệ thống"
                    >
                      <Trash className="w-4 h-4" />
                      Xóa toàn bộ
                    </button>
                  </div>
                </div>

                {/* MCQ Question Cards Panel */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {(() => {
                    const filtered = questions.filter(q => {
                      if (mcqCategoryFilter !== 'all' && q.category !== mcqCategoryFilter) return false;
                      if (mcqDifficultyFilter !== 'all' && q.difficulty !== mcqDifficultyFilter) return false;
                      if (mcqSearchText.trim() && !q.questionText.toLowerCase().includes(mcqSearchText.toLowerCase())) return false;
                      return true;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-150 text-slate-400 italic text-xs">
                          Chưa có câu hỏi trắc nghiệm nào thỏa mãn bộ lọc bên trên.
                        </div>
                      );
                    }

                    return filtered.map((q, qidx) => (
                      <div key={q.id || qidx} className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors duration-100 flex flex-col justify-between">
                        <div>
                          {/* Card tags top row */}
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-150">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-mono bg-slate-200 px-2 py-0.5 text-slate-650 rounded font-bold">
                                ID: {q.id.replace('q_manual_', 'M_').replace('law_ai_idx_', 'AI_L_').replace('computer_ai_idx_', 'AI_C_').replace('phishing_ai_idx_', 'AI_P_').replace('account_ai_idx_', 'AI_A_').replace('data_ai_idx_', 'AI_D_').substring(0, 16)}
                              </span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${q.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-800 border-emerald-250 border' : q.difficulty === 'medium' ? 'bg-amber-100 text-amber-850 border-amber-250 border' : 'bg-red-100 text-red-800 border-red-250 border'}`}>
                                {q.difficulty === 'easy' ? 'DỄ' : q.difficulty === 'medium' ? 'TRUNG BÌNH' : 'KHÓ'}
                              </span>
                              <span className="text-[9px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                                {q.category === 'law' ? 'Pháp luật hành chính' : q.category === 'computer' ? 'Sử dụng máy tính' : q.category === 'phishing' ? 'Nhận diện lừa đảo' : q.category === 'account' ? 'Quản lý tài khoản' : 'Bảo vệ dữ liệu'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEditMCQClick(q)}
                                className="p-1 px-2.5 bg-white border border-slate-200 rounded text-blue-700 hover:bg-blue-50 text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                              >
                                <Edit className="w-3 h-3" /> Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteMCQClick(q.id)}
                                className="p-1 px-2.5 bg-red-50 border border-red-200 rounded text-red-700 hover:bg-red-100 text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                              >
                                <Trash className="w-3 h-3" /> Xóa
                              </button>
                            </div>
                          </div>

                          {/* Question text */}
                          <p className="text-[1rem] font-bold text-slate-800 leading-relaxed mb-3">
                            {qidx + 1}. {q.questionText}
                          </p>

                          {/* Grid options A, B, C, D */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                            {q.choices.map((c) => {
                              const isCorrect = c.id === q.correctAnswerId;
                              return (
                                <div 
                                  key={c.id} 
                                  className={`p-2.5 rounded-lg text-[0.9rem] leading-normal flex items-start gap-1.5 ${isCorrect ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-medium' : 'bg-white border border-slate-150 text-slate-600'}`}
                                >
                                  <strong className={`font-mono text-[0.9rem] shrink-0 font-bold ${isCorrect ? 'text-emerald-700' : 'text-slate-400'}`}>
                                    {c.id}.
                                  </strong>
                                  <span className="font-normal text-[0.9rem]">{c.text}</span>
                                  {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />}
                                </div>
                              );
                            })}
                          </div>

                          {/* Theory explanation */}
                          {q.explanation && (
                            <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-lg text-[0.9rem] leading-relaxed text-indigo-800 flex items-start gap-1.5 font-normal">
                              <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <strong className="font-bold">Lý luận giảng giải:</strong> {q.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}

            {/* SCENARIO SECTION INSIDE BANK TAB */}
            {bankTab === 'scenario' && (
              <div className="space-y-4">
                {/* Scenario Header query row */}
                <div className="flex flex-col md:flex-row gap-3 bg-slate-50 p-4 rounded-xl border border-slate-150">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm nội dung hay chủ đề tình huống bảo vệ..."
                      value={sceSearchText}
                      onChange={(e) => setSceSearchText(e.target.value)}
                      className="w-full text-xs p-2 pl-9 bg-white border border-slate-200 rounded-lg text-slate-700 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCreateScenarioClick}
                      className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 h-[34px] cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm tình huống
                    </button>
                    <button
                      onClick={handleClearAllScenarioQuestions}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 h-[34px] cursor-pointer whitespace-nowrap transition-colors"
                      title="Xóa toàn bộ câu hỏi tình huống trong hệ thống"
                    >
                      <Trash className="w-4 h-4" />
                      Xóa toàn bộ
                    </button>
                  </div>
                </div>

                {/* Scenario Question Cards Panel */}
                <div className="space-y-5 max-h-[500px] overflow-y-auto pr-1">
                  {(() => {
                    const filtered = scenarios.filter(s => {
                      if (sceSearchText.trim()) {
                        const word = sceSearchText.toLowerCase();
                        return s.topic.toLowerCase().includes(word) || s.scenarioText.toLowerCase().includes(word);
                      }
                      return true;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-150 text-slate-400 italic text-xs">
                          Chưa có kịch bản tình huống thực sinh nào thỏa mãn bộ lọc bên trên.
                        </div>
                      );
                    }

                    return filtered.map((s, idx) => (
                      <div key={s.id || idx} className="bg-slate-50/50 border border-slate-250 rounded-xl p-5 hover:border-slate-300 transition-colors flex flex-col justify-between">
                        <div>
                          {/* Card tags header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono bg-slate-200 px-2.5 py-0.5 text-slate-650 rounded font-bold">
                                ID: {s.id.substring(0, 16)}
                              </span>
                              <span className="text-[10px] bg-slate-800 text-white px-2.5 py-0.5 rounded-full font-bold">
                                Chủ đề: {s.topic}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEditScenarioClick(s)}
                                className="p-1 px-2.5 bg-white border border-slate-200 rounded text-blue-700 hover:bg-blue-50 text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-sm animate-none"
                              >
                                <Edit className="w-3 h-3" /> Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteScenarioClick(s.id)}
                                className="p-1 px-2.5 bg-red-50 border border-red-200 rounded text-red-700 hover:bg-red-100 text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                              >
                                <Trash className="w-3 h-3" /> Xóa
                              </button>
                            </div>
                          </div>

                          {/* Story Context Block */}
                          <div className="mb-4">
                            <label className="block text-[9.5px] font-extrabold text-blue-800 tracking-wider mb-1">
                              BỐI CẢNH MÔ PHỎNG THỰC TẾ
                            </label>
                            <p className="text-xs bg-white border border-slate-200 p-3 rounded-lg leading-relaxed text-slate-700 font-normal">
                              {s.scenarioText}
                            </p>
                          </div>

                          {/* 3 Step Interactive details */}
                          <div className="space-y-4 pt-1">
                            {/* Step 1 */}
                            <div className="bg-white border border-slate-150 p-3.5 rounded-xl space-y-2">
                              <div className="text-[10px] font-extrabold text-slate-400">BƯỚC 1: XÁC ĐỊNH MỐI NGUY HẠI</div>
                              <p className="text-xs font-bold text-slate-800 leading-normal">{s.step1.prompt}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[0.9rem]">
                                {s.step1.choices.map((c) => {
                                  const isCorrect = c.id === s.step1.correctAnswerId;
                                  return (
                                    <div key={c.id} className={`p-2 rounded-lg border text-[0.9rem] ${isCorrect ? 'bg-emerald-50 border-emerald-350 text-emerald-900 font-semibold' : 'border-slate-100 text-slate-500'}`}>
                                      {c.id}. {c.text}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Step 2 */}
                            <div className="bg-white border border-slate-150 p-3.5 rounded-xl space-y-2">
                              <div className="text-[10px] font-extrabold text-slate-400">BƯỚC 2: QUY TRÌNH XỬ LÝ AN TOÀN</div>
                              <p className="text-xs font-bold text-slate-800 leading-normal">{s.step2.prompt}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[0.9rem]">
                                {s.step2.choices.map((c) => {
                                  const isCorrect = c.id === s.step2.correctAnswerId;
                                  return (
                                    <div key={c.id} className={`p-2 rounded-lg border text-[0.9rem] ${isCorrect ? 'bg-emerald-50 border-emerald-350 text-emerald-900 font-semibold' : 'border-slate-100 text-slate-500'}`}>
                                      {c.id}. {c.text}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Step 3 */}
                            <div className="bg-white border border-slate-150 p-3.5 rounded-xl space-y-2">
                              <div className="text-[10px] font-extrabold text-slate-400">BƯỚC 3: PHÂN TÍCH Ý NGHĨA PHÒNG THỦ</div>
                              <p className="text-xs font-bold text-slate-800 leading-normal">{s.step3.prompt}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[0.9rem]">
                                {s.step3.choices.map((c) => {
                                  const isCorrect = c.id === s.step3.correctAnswerId;
                                  return (
                                    <div key={c.id} className={`p-2 rounded-lg border text-[0.9rem] ${isCorrect ? 'bg-emerald-50 border-emerald-350 text-emerald-900 font-semibold' : 'border-slate-100 text-slate-500'}`}>
                                      {c.id}. {c.text}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Explanation */}
                          {s.explanation && (
                            <div className="mt-4 p-3 bg-indigo-50/50 border border-indigo-150 rounded-xl text-[0.9rem] leading-relaxed text-indigo-850 font-normal">
                              <strong>Luyện giải thực chiến:</strong> {s.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AUDIT LOG PANEL */}
      {selectedTab === 'audit' && (user.role === 'admin' || user.role === 'superuser' || user.role === 'manager') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" id="audit-log-panel">
          <h2 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" />
            Nhật ký Sự cố Bảo mật & Trực ban giám sát phòng thi
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans font-normal">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="p-2.5">Thời gian thực</th>
                  <th className="p-2.5">Cán bộ thực hiện</th>
                  <th className="p-2.5">Xã, Phường</th>
                  <th className="p-2.5">Sự kiện hành động</th>
                  <th className="p-2.5">Chi tiết ghi nhận</th>
                  <th className="p-2.5">Địa chỉ IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-normal">
                {auditLogs.length > 0 ? (
                  auditLogs.slice().reverse().map((log, idx) => (
                    <tr 
                      key={idx} 
                      className={`hover:bg-slate-50/50 ${log.action === "Cảnh báo gian lận" ? "bg-red-50/50 text-red-800" : ""}`}
                    >
                      <td className="p-2.5 text-slate-400 font-mono whitespace-nowrap">{formatDate(log.timestamp)}</td>
                      <td className="p-2.5 font-bold text-slate-800">{log.fullName}</td>
                      <td className="p-2.5 text-slate-500">{adminUsers.find(au => au.id === log.userId)?.department || "Ban giám sát"}</td>
                      <td className="p-2.5 font-bold">
                        {log.action === "Cảnh báo gian lận" ? (
                          <span className="inline-flex items-center gap-1 text-red-600 font-bold">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Cảnh báo gian lận
                          </span>
                        ) : (
                          log.action
                        )}
                      </td>
                      <td className="p-2.5 text-slate-650 max-w-xs truncate" title={log.details}>{log.details}</td>
                      <td className="p-2.5 text-slate-400 font-mono">{log.ipAddress}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 italic">Không tìm thấy nhật ký hoặc thông báo nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OVERLAY MODAL FORM FOR EDITING / ADDING MCQ QUESTIONS */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="edit-mcq-modal">
          <form 
            onSubmit={handleSaveMCQSubmit} 
            className="bg-white border border-slate-250 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-indigo-600" />
                {isAddingNewMCQ ? 'Thêm câu hỏi Trắc nghiệm khách quan mới' : 'Cập nhật cấu trúc câu hỏi Trắc nghiệm'}
              </h3>
              <button 
                type="button" 
                onClick={() => { setEditingQuestion(null); setIsAddingNewMCQ(false); }}
                className="p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isAddingNewMCQ && (
              <div className="flex bg-slate-100 p-1 rounded-xl w-full select-none shrink-0 border border-slate-200/40">
                <button
                  type="button"
                  onClick={() => setMcqInputMode('form')}
                  className={`flex-1 py-1 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${mcqInputMode === 'form' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-705'}`}
                >
                  Nhập từ biểu mẫu
                </button>
                <button
                  type="button"
                  onClick={() => setMcqInputMode('json')}
                  className={`flex-1 py-1 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${mcqInputMode === 'json' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-705'}`}
                >
                  Nhập nhanh JSON [{`{...}`}]
                </button>
              </div>
            )}

            {isAddingNewMCQ && mcqInputMode === 'json' ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-150">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Dữ liệu dạng JSON của danh sách câu hỏi</span>
                  <button 
                    type="button"
                    onClick={() => {
                      setJsonImportText(`[\n  {\n    "id": 100,\n    "topic": "dulieu",\n    "text": "Tại sao không nên sao lưu dữ liệu mật lên Google Drive cá nhân, Zalo hay ổ đĩa cá nhân?",\n    "opts": [\n      "A. Tốc độ tải lên quá chậm",\n      "B. Vi phạm quy định bảo mật, dễ bị rò rỉ ra ngoài phạm vi kiểm soát của cơ quan",\n      "C. Dung lượng không đủ",\n      "D. Tốn chi phí lưu trữ"\n    ],\n    "ans": 1\n  }\n]`);
                    }}
                    className="text-[10px] font-extrabold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer bg-white px-2 py-1 rounded border border-blue-200 shadow-sm"
                  >
                    Xem kịch bản mẫu
                  </button>
                </div>
                <textarea
                  value={jsonImportText}
                  onChange={(e) => setJsonImportText(e.target.value)}
                  rows={12}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none leading-relaxed h-[240px]"
                  placeholder='Nhập danh sách câu hỏi theo dạng [{"id": 100, "topic": "dulieu", "text": "...", "opts": [...], "ans": 1}]'
                  required
                />
                <p className="text-[10px] text-slate-500 font-medium leading-normal italic bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                  * Hệ thống tự động bóc tách các lựa chọn "A. ", "B. ", "C. ", "D. ", ánh xạ chuyên đề "dulieu" sang nhánh "Bảo vệ và Quản lý dữ liệu", và lưu trữ an toàn. Trùng lắp "id" sẽ ghi đè cập nhật đề thi.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-450 uppercase mb-1">Chuyên đề câu đố (Category)</label>
                    <select
                      value={editingQuestion.category}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, category: e.target.value as any })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-850"
                    >
                      <option value="law">Quy định pháp luật số</option>
                      <option value="computer">Sử dụng máy tính an toàn</option>
                      <option value="phishing">Nhận diện lừa đảo trực tuyến</option>
                      <option value="account">Quản lý tài khoản mật</option>
                      <option value="data">Bảo vệ và Quản lý dữ liệu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-450 uppercase mb-1">Cấp độ sâu (Difficulty)</label>
                    <select
                      value={editingQuestion.difficulty}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, difficulty: e.target.value as any })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-850"
                    >
                      <option value="easy">Cơ bản (Dễ)</option>
                      <option value="medium">Trung cấp (Trung bình)</option>
                      <option value="hard">Chuyên sâu (Khó)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-450 uppercase mb-1">Nội dung câu hỏi đề</label>
                  <textarea
                    value={editingQuestion.questionText}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, questionText: e.target.value })}
                    rows={3}
                    placeholder="Ví dụ: Đâu là hành vi chuẩn mực của cán bộ một cửa khi nhận thấy máy tính cơ quan dính virus..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-850 outline-none h-18 resize-none font-sans font-normal"
                    required={mcqInputMode === 'form'}
                  />
                </div>

                {/* MCQ choices A, B, C, D */}
                <div className="space-y-3 pt-1">
                  <label className="block text-[10px] font-extrabold text-blue-900 uppercase">Các phương án trả lời</label>
                  {editingQuestion.choices.map((c, cidx) => (
                    <div key={c.id} className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-455 shrink-0 w-6 text-center">{c.id}.</span>
                      <input
                        type="text"
                        value={c.text}
                        onChange={(e) => {
                          const newChoices = [...editingQuestion.choices];
                          newChoices[cidx] = { ...newChoices[cidx], text: e.target.value };
                          setEditingQuestion({ ...editingQuestion, choices: newChoices });
                        }}
                        placeholder={`Nội dung phương án ${c.id}`}
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                        required={mcqInputMode === 'form'}
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-450 uppercase mb-1">ĐÁP ÁN ĐÚNG BẢN ĐỒ</label>
                    <select
                      value={editingQuestion.correctAnswerId}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, correctAnswerId: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-850 font-bold"
                    >
                      <option value="A">Phương án A</option>
                      <option value="B">Phương án B</option>
                      <option value="C">Phương án C</option>
                      <option value="D">Phương án D</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-455 uppercase mb-1">Lý thuyết dẫn luận sư phạm</label>
                    <textarea
                      value={editingQuestion.explanation}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                      rows={2}
                      placeholder="Giảng giải lý do tại sao phương án đó đúng..."
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-850 h-11 resize-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-150">
              <button
                type="button"
                onClick={() => { setEditingQuestion(null); setIsAddingNewMCQ(false); }}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors shadow"
              >
                {isAddingNewMCQ && mcqInputMode === 'json' ? 'Tìm nạp & Nhập JSON' : 'Lưu toàn văn'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* OVERLAY MODAL FORM FOR EDITING / ADDING 3-STEP SCENARIOS */}
      {editingScenario && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="edit-scenario-modal">
          <form 
            onSubmit={handleSaveScenarioSubmit} 
            className="bg-white border border-slate-250 rounded-2xl p-6 max-w-3xl w-full max-h-[92vh] overflow-y-auto space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <ListCollapse className="w-4 h-4 text-emerald-600" />
                {isAddingNewScenario ? 'Thêm mới kịch bản an toàn số' : 'Cập nhật nội dung tình huống 3 Bước'}
              </h3>
              <button 
                type="button" 
                onClick={() => { setEditingScenario(null); setIsAddingNewScenario(false); }}
                className="p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold text-slate-450 uppercase mb-1">Chủ đề huấn luyện (Topic)</label>
              <input
                type="text"
                value={editingScenario.topic}
                onChange={(e) => setEditingScenario({ ...editingScenario, topic: e.target.value })}
                placeholder="Ví dụ: Email giả mạo sếp Sở, Zalo lừa tinh..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold text-slate-455 uppercase mb-1">Bối cảnh chi tiết kịch bản mô phỏng</label>
              <textarea
                value={editingScenario.scenarioText}
                onChange={(e) => setEditingScenario({ ...editingScenario, scenarioText: e.target.value })}
                rows={3}
                placeholder="Nội dung kịch bản xã phường..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 h-20 resize-none font-normal"
                required
              />
            </div>

            {/* Step 1 Form section */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-3.5 border border-slate-150">
              <h4 className="text-[10px] font-extrabold text-blue-900 border-b border-slate-200 pb-1 uppercase tracking-wider">
                BƯỚC 1: XÁC ĐỊNH MỐI NGUY HẠI (Phòng thủ bị động)
              </h4>
              <div className="space-y-1">
                <label className="block text-[9.5px] text-slate-500 font-bold">Câu hỏi bước 1:</label>
                <input
                  type="text"
                  value={editingScenario.step1.prompt}
                  onChange={(e) => setEditingScenario({
                    ...editingScenario,
                    step1: { ...editingScenario.step1, prompt: e.target.value }
                  })}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {editingScenario.step1.choices.map((ch, idx) => (
                  <div key={ch.id} className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-450">{ch.id}.</span>
                    <input
                      type="text"
                      value={ch.text}
                      onChange={(e) => {
                        const newChs = [...editingScenario.step1.choices];
                        newChs[idx] = { ...newChs[idx], text: e.target.value };
                        setEditingScenario({
                          ...editingScenario,
                          step1: { ...editingScenario.step1, choices: newChs }
                        });
                      }}
                      className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg"
                      required
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-[9.5px] font-bold text-slate-500">ĐÁP ÁN ĐÚNG BƯỚC 1:</label>
                <select
                  value={editingScenario.step1.correctAnswerId}
                  onChange={(e) => setEditingScenario({
                    ...editingScenario,
                    step1: { ...editingScenario.step1, correctAnswerId: e.target.value }
                  })}
                  className="text-xs p-2 bg-white border border-slate-200 rounded-lg mt-0.5"
                >
                  <option value="A">Phương án A</option>
                  <option value="B">Phương án B</option>
                  <option value="C">Phương án C</option>
                  <option value="D">Phương án D</option>
                </select>
              </div>
            </div>

            {/* Step 2 Form section */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-3.5 border border-slate-150">
              <h4 className="text-[10px] font-extrabold text-blue-900 border-b border-slate-200 pb-1 uppercase tracking-wider">
                BƯỚC 2: QUY TRÌNH XỬ LÝ AN TOÀN TỐI ƯU
              </h4>
              <div className="space-y-1">
                <label className="block text-[9.5px] text-slate-500 font-bold">Câu hỏi bước 2:</label>
                <input
                  type="text"
                  value={editingScenario.step2.prompt}
                  onChange={(e) => setEditingScenario({
                    ...editingScenario,
                    step2: { ...editingScenario.step2, prompt: e.target.value }
                  })}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {editingScenario.step2.choices.map((ch, idx) => (
                  <div key={ch.id} className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-450">{ch.id}.</span>
                    <input
                      type="text"
                      value={ch.text}
                      onChange={(e) => {
                        const newChs = [...editingScenario.step2.choices];
                        newChs[idx] = { ...newChs[idx], text: e.target.value };
                        setEditingScenario({
                          ...editingScenario,
                          step2: { ...editingScenario.step2, choices: newChs }
                        });
                      }}
                      className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg"
                      required
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-[9.5px] font-bold text-slate-500">ĐÁP ÁN ĐÚNG BƯỚC 2:</label>
                <select
                  value={editingScenario.step2.correctAnswerId}
                  onChange={(e) => setEditingScenario({
                    ...editingScenario,
                    step2: { ...editingScenario.step2, correctAnswerId: e.target.value }
                  })}
                  className="text-xs p-2 bg-white border border-slate-200 rounded-lg mt-0.5"
                >
                  <option value="A">Phương án A</option>
                  <option value="B">Phương án B</option>
                  <option value="C">Phương án C</option>
                  <option value="D">Phương án D</option>
                </select>
              </div>
            </div>

            {/* Step 3 Form section */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-3.5 border border-slate-150">
              <h4 className="text-[10px] font-extrabold text-blue-900 border-b border-slate-200 pb-1 uppercase tracking-wider">
                BƯỚC 3: Ý NGHĨA PHÒNG THỦ KHÔNG GIAN SỐ
              </h4>
              <div className="space-y-1">
                <label className="block text-[9.5px] text-slate-500 font-bold">Câu hỏi bước 3:</label>
                <input
                  type="text"
                  value={editingScenario.step3.prompt}
                  onChange={(e) => setEditingScenario({
                    ...editingScenario,
                    step3: { ...editingScenario.step3, prompt: e.target.value }
                  })}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {editingScenario.step3.choices.map((ch, idx) => (
                  <div key={ch.id} className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-450">{ch.id}.</span>
                    <input
                      type="text"
                      value={ch.text}
                      onChange={(e) => {
                        const newChs = [...editingScenario.step3.choices];
                        newChs[idx] = { ...newChs[idx], text: e.target.value };
                        setEditingScenario({
                          ...editingScenario,
                          step3: { ...editingScenario.step3, choices: newChs }
                        });
                      }}
                      className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg"
                      required
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2.5">
                <label className="block text-[9.5px] font-bold text-slate-500">ĐÁP ÁN ĐÚNG BƯỚC 3:</label>
                <select
                  value={editingScenario.step3.correctAnswerId}
                  onChange={(e) => setEditingScenario({
                    ...editingScenario,
                    step3: { ...editingScenario.step3, correctAnswerId: e.target.value }
                  })}
                  className="text-xs p-2 bg-white border border-slate-200 rounded-lg mt-0.5"
                >
                  <option value="A">Phương án A</option>
                  <option value="B">Phương án B</option>
                  <option value="C">Phương án C</option>
                  <option value="D">Phương án D</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold text-slate-450 uppercase mb-1">Gợi lý luận bài học sâu sắc</label>
              <textarea
                value={editingScenario.explanation}
                onChange={(e) => setEditingScenario({ ...editingScenario, explanation: e.target.value })}
                rows={2}
                placeholder="Bài giảng ngắn dỗ dành tư duy cán bộ..."
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 resize-none font-normal"
              />
            </div>

            <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-150">
              <button
                type="button"
                onClick={() => { setEditingScenario(null); setIsAddingNewScenario(false); }}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors shadow animate-none"
              >
                Lưu tình huống
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CUSTOM FLOATING TIMEOUT-FREE TOAST BANNER NOTIFICATIONS */}
      {notifyMsg && (
        <div className="fixed bottom-6 right-6 p-4 rounded-2xl flex items-center gap-3 border shadow-2xl z-50 animate-bounce duration-300 bg-white max-w-sm border-slate-200" id="custom-toast-notification">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notifyType === 'success' ? 'bg-emerald-100 text-emerald-600' : notifyType === 'error' ? 'bg-red-100 text-red-650' : 'bg-blue-100 text-blue-600'}`}>
            {notifyType === 'success' ? <Check className="w-5 h-5" /> : notifyType === 'error' ? <AlertTriangle className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
          </div>
          <div className="flex-1 text-xs text-slate-700 leading-normal font-semibold font-sans">
            {notifyMsg}
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRM DIALOG OVERLAY PORTAL */}
      {confirmModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="custom-confirm-modal">
          <div className="bg-white border border-slate-250 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-red-100 border border-red-200 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">
              Yêu cầu xác nhận pháp quy
            </h3>

            <p className="text-xs text-slate-500 leading-normal font-normal">
              {confirmModal.message}
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2 text-slate-650 bg-slate-100 border border-slate-200 hover:bg-slate-200 font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setConfirmModal(null);
                  confirmModal.onConfirm();
                }}
                className="flex-1 py-2 text-white bg-red-600 hover:bg-red-700 font-bold text-xs rounded-xl cursor-pointer transition-colors shadow"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPERUSER DELEGATION PANEL */}
      {selectedTab === 'delegation' && user.role === 'superuser' && (
        <div className="space-y-6 animate-fade-in" id="delegation-panel">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Ủy quyền Quản lý đơn vị Xã/Phường
            </h2>
            <p className="text-xs text-slate-500 mb-4 font-normal">
              Là <strong>Super User</strong>, đồng chí có thẩm quyền chỉ định các tài khoản Gmail cá nhân làm <strong>Quản lý đơn vị</strong>. Họ sẽ được phép theo dõi kết quả sát hạch và tiến trình học tập của các cán bộ thuộc xã/phường được phụ trách. Đồng chí có thể quản trị thêm hoặc xóa bớt đơn vị quản trị quản lý, thu hồi quyền hạn hoặc Reset thi cho học viên của đơn vị đó.
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newManagerEmail.trim() || !newManagerName.trim() || !newManagerDept) {
                  triggerAlert("Vui lòng điền thông tin email, họ tên và chọn đơn vị cho quản lý.", "error");
                  return;
                }
                setAssigningLoading(true);
                try {
                  const res = await fetch('/api/superuser/assign-manager', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      email: newManagerEmail,
                      fullName: newManagerName,
                      department: newManagerDept
                    })
                  });
                  const d = await res.json();
                  if (res.ok) {
                    triggerAlert(d.message || "Phân quyền quản lý thành công!", "success");
                    setNewManagerEmail('');
                    setNewManagerName('');
                    setNewManagerDept('');
                    setRefreshTrigger(prev => prev + 1);
                  } else {
                    triggerAlert(d.error || "Gặp lỗi phân quyền.", "error");
                  }
                } catch {
                  triggerAlert("Lỗi mạng không thể liên kết.", "error");
                } finally {
                  setAssigningLoading(false);
                }
              }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-150 font-sans"
            >
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Địa chỉ Gmail quản lý:</label>
                <input
                  type="email"
                  required
                  placeholder="Ví dụ: quanly@gmail.com"
                  value={newManagerEmail}
                  onChange={e => setNewManagerEmail(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Họ và tên người quản lý:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={newManagerName}
                  onChange={e => setNewManagerName(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Đơn vị, Xã/Phường phụ trách:</label>
                <select
                  required
                  value={newManagerDept}
                  onChange={e => setNewManagerDept(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-800 cursor-pointer"
                >
                  <option value="">-- Chọn xã/phường --</option>
                  {departments.map((dep) => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={assigningLoading}
                className="w-full bg-indigo-700 hover:bg-indigo-800 disabled:bg-slate-400 text-white font-bold py-2 px-4 rounded-lg text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer text-center h-9"
              >
                {assigningLoading ? 'Đang phân quyền...' : 'Cấp quyền Quản lý'}
              </button>
            </form>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-1.5">
              Danh sách Quản lý Đơn vị đang được ủy quyền
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-3">Họ và tên</th>
                    <th className="p-3">Gmail liên kết</th>
                    <th className="p-3">Xã/Phường phụ trách</th>
                    <th className="p-3">Vai trò</th>
                    <th className="p-3 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {managers.length > 0 ? (
                    managers.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-905">{m.fullName}</td>
                        <td className="p-3 font-mono text-slate-500">{m.username}</td>
                        <td className="p-3 text-slate-800 font-medium">{m.department}</td>
                        <td className="p-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase text-white ${
                            m.role === 'superuser' ? 'bg-indigo-600' : 'bg-teal-600'
                          }`}>
                            {m.role === 'superuser' ? 'Super User' : 'Quản lý đơn vị'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {m.role === 'superuser' ? (
                            <span className="text-slate-400 italic font-medium">Bất khả xâm phạm</span>
                          ) : (
                            <button
                              onClick={() => {
                                setConfirmModal({
                                  message: `Đồng chí chắc chắn muốn thu hồi quyền Quản lý đơn vị của ${m.fullName}? Tài khoản này sẽ quay lại làm học viên sát hạch bình thường.`,
                                  onConfirm: async () => {
                                    try {
                                      const res = await fetch('/api/superuser/remove-manager', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                          'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify({ userId: m.id })
                                      });
                                      if (res.ok) {
                                        triggerAlert("Đã thu hồi quyền quản trị thành công!", "success");
                                        setRefreshTrigger(prev => prev + 1);
                                      } else {
                                        const d = await res.json();
                                        triggerAlert(d.error || "Gặp lỗi khi thu hồi.", "error");
                                      }
                                    } catch {
                                      triggerAlert("Lỗi mạng.", "error");
                                    }
                                  }
                                });
                              }}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-650 font-bold border border-red-100 rounded text-[9px] cursor-pointer transition-all"
                            >
                              Thu hồi quyền
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 italic">Chưa ủy quyền tài khoản quản lý nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Fallback for tabs regular users can't access */}
      {((selectedTab === 'global' && (!stats?.global || (user.role !== 'admin' && user.role !== 'superuser' && user.role !== 'manager'))) || 
        (selectedTab === 'bank' && user.role !== 'admin' && user.role !== 'superuser') || 
        (selectedTab === 'audit' && user.role !== 'admin' && user.role !== 'superuser' && user.role !== 'manager') ||
        (selectedTab === 'delegation' && user.role !== 'superuser')) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-xl mx-auto shadow-sm text-center my-12" id="restricted-access-panel">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Quyền Truy Cập Hạn Chế</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Khu vực này chứa dữ liệu thống kê, quản lý ngân hàng đề sát hạch và nhật ký giám sát hoạt động bảo mật thông tin của toàn bộ đơn vị. Chỉ các tài khoản có thẩm quyền cấp quản lý hoặc giám sát mới được phép truy cập và điều hành.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setSelectedTab('individual')}
              className="px-4 py-2 bg-blue-800 hover:bg-blue-950 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all duration-150 inline-flex items-center gap-1.5"
            >
              Quay lại trang cá nhân
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
