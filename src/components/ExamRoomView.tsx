/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, Clock, Save, FileText, CheckCircle2, 
  HelpCircle, ChevronLeft, ChevronRight, AlertTriangle, Send
} from 'lucide-react';
import { Question, ScenarioQuestion } from '../types';

interface ExamRoomViewProps {
  attemptId: string;
  attemptNumber: number;
  questions: Question[];
  scenarios: ScenarioQuestion[];
  startedAt: string;
  token: string;
  onExamSubmit: (submitData: any) => void;
}

export default function ExamRoomView({
  attemptId,
  attemptNumber,
  questions,
  scenarios,
  startedAt,
  token,
  onExamSubmit
}: ExamRoomViewProps) {
  // Navigation states
  const [activePart, setActivePart] = useState<'A' | 'B'>('A');
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0); // 0 to 19 for Part A, 0 to 4 for Part B

  // Answers state
  const [answers, setAnswers] = useState<{
    partA: { [questionId: string]: string };
    partB: { 
      [scenarioId: string]: {
        step1: string;
        step2: string;
        step3: string;
      } 
    };
  }>(() => {
    const initialPartA: { [questionId: string]: string } = {};
    questions.forEach(q => {
      initialPartA[q.id] = '';
    });
    const initialPartB: { [scenarioId: string]: any } = {};
    scenarios.forEach(s => {
      initialPartB[s.id] = { step1: '', step2: '', step3: '' };
    });
    return { partA: initialPartA, partB: initialPartB };
  });

  // Anti-cheat & timing
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showCheatOverlay, setShowCheatOverlay] = useState(false);
  const [showAutosaveFlash, setShowAutosaveFlash] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Focus and Tab Switching detector
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setTabSwitchCount(prev => {
          const nextVal = prev + 1;
          
          // Log cheating log directly inside the backend audit trail
          fetch('/api/exam/cheat-warning', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              attemptId,
              currentWarningsCount: nextVal,
              detail: `Học viên chuyển tab / dời màn hình thi. Cảnh cáo vi phạm thứ ${nextVal}/3.`
            })
          }).catch(err => console.error(err));

          return nextVal;
        });

        setShowCheatOverlay(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [attemptId, token]);

  // Prevent copying, selection, printing, view source, developer tools, and right click menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        ((e.ctrlKey || e.metaKey || e.altKey) && (key === 'c' || key === 'x' || key === 'a' || key === 'u' || key === 's' || key === 'p')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('copy', handleCopy, true);
    window.addEventListener('cut', handleCut, true);
    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('selectstart', handleSelectStart, true);
    window.addEventListener('dragstart', handleDragStart, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('copy', handleCopy, true);
      window.removeEventListener('cut', handleCut, true);
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('selectstart', handleSelectStart, true);
      window.removeEventListener('dragstart', handleDragStart, true);
    };
  }, []);

  // Active Timer counting down
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Auto submit when times out
          handleForceSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Autosave interval every 30 seconds
  useEffect(() => {
    const autosaveTimer = setInterval(() => {
      fetch('/api/exam/autosave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          attemptId,
          answers,
          timeSpentSeconds: 1800 - timeLeft
        })
      })
        .then(res => {
          if (res.ok) {
            setShowAutosaveFlash(true);
            setTimeout(() => setShowAutosaveFlash(false), 2500);
          }
        })
        .catch(err => console.error("Autosave failed", err));
    }, 30000);

    return () => clearInterval(autosaveTimer);
  }, [attemptId, answers, timeLeft, token]);

  const handleForceSubmit = () => {
    submitExam(answers, 1800);
  };

  const submitExam = async (finalAnswers = answers, timeSpent = (1800 - timeLeft)) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          attemptId,
          answers: finalAnswers,
          timeSpentSeconds: timeSpent
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gặp sự cố khi nộp bài thi.");
      }

      onExamSubmit(data);
    } catch (err: any) {
      alert("Lỗi nộp bài: " + err.message);
      setSubmitting(false);
    }
  };

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const handleManualSubmit = () => {
    setShowSubmitModal(true);
  };

  // Convert seconds to format MM:SS
  const getFormattedTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Save selected option for MCQ (Part A)
  const handleSelectA = (qId: string, choiceId: string) => {
    setAnswers(prev => ({
      ...prev,
      partA: {
        ...prev.partA,
        [qId]: choiceId
      }
    }));
  };

  // Save selected option for Scenario step (Part B)
  const handleSelectB = (sId: string, step: 'step1' | 'step2' | 'step3', choiceId: string) => {
    setAnswers(prev => ({
      ...prev,
      partB: {
        ...prev.partB,
        [sId]: {
          ...prev.partB[sId],
          [step]: choiceId
        }
      }
    }));
  };

  const currentQuestion = questions[activeQuestionIdx];
  const currentScenario = scenarios[activeQuestionIdx];

  const valueSelectedA = currentQuestion ? answers.partA[currentQuestion.id] : null;
  const valueSelectedB1 = currentScenario ? answers.partB[currentScenario.id]?.step1 : null;
  const valueSelectedB2 = currentScenario ? answers.partB[currentScenario.id]?.step2 : null;
  const valueSelectedB3 = currentScenario ? answers.partB[currentScenario.id]?.step3 : null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto w-screen h-screen select-none p-6 font-sans text-slate-900" 
      id="exam-room-fullscreen-container"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
        MozUserSelect: 'none'
      }}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 pb-12" id="exam-room-grid">
      
      {/* Top Banner indicating countdown and auto-save state */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4" id="exam-dashboard-bar">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800">Sát hạch - Lượt thi {attemptNumber}/5</h1>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Mã phiên: {attemptId}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Autosaver flash */}
          {showAutosaveFlash && (
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold animate-pulse flex items-center gap-1.1">
              <Save className="w-3 h-3" />
              Đã lưu nháp tự động...
            </span>
          )}

          {/* Clock timer */}
          <div className={`p-2.5 rounded-xl border flex items-center gap-2 font-mono text-sm font-bold shadow-sm transition-colors ${timeLeft < 120 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
            <Clock className="w-4 h-4" />
            <span>{getFormattedTime()}</span>
          </div>

          <button
            onClick={handleManualSubmit}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50 shadow"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'ĐANG NỘP BÀI...' : 'Nộp bài thi'}
          </button>
        </div>
      </div>

      {/* Main question box */}
      <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between" id="active-question-card">
        {activePart === 'A' && currentQuestion ? (
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-1 pt-1 mb-4 bg-[#ddf1e4] px-3 rounded-lg">
              <span className="text-[13px] font-bold uppercase tracking-wider bg-[#dceee1] px-2 py-0.5 rounded text-slate-500 border border-[#a8bfe0]">
                PHẦN A: Trắc nghiệm khách quan ({activeQuestionIdx + 1}/20)
              </span>
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded uppercase ${currentQuestion.difficulty === 'hard' ? 'bg-red-100 text-red-700' : currentQuestion.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                {currentQuestion.difficulty === 'hard' ? 'Nâng cao' : currentQuestion.difficulty === 'medium' ? 'Trung bình' : 'Cơ bản'}
              </span>
            </div>

            <h2 className="text-[1.1rem] font-bold text-slate-800 leading-relaxed mb-6">
              {currentQuestion.questionText}
            </h2>

            <div className="space-y-3">
              {currentQuestion.choices.map((choice) => {
                const isSelected = valueSelectedA === choice.id;
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectA(currentQuestion.id, choice.id)}
                    className={`w-full p-4 rounded-xl border text-left text-[1.0rem] transition-all relative flex items-start gap-3 cursor-pointer ${isSelected ? 'border-blue-600 bg-blue-50/40 text-blue-900 font-medium' : 'border-slate-150 bg-white hover:border-slate-350 text-slate-700'}`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                    <span>{choice.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : activePart === 'B' && currentScenario ? (
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-1 pt-1 mb-4 bg-[#ddf1e4] px-3 rounded-lg">
              <span className="text-[13px] font-bold uppercase tracking-wider bg-[#dceee1] px-2 py-0.5 rounded text-purple-700 border border-[#a8bfe0]">
                PHẦN B: Tình huống chuyên môn ({activeQuestionIdx + 1}/5)
              </span>
              <span className="text-[10px] font-bold text-indigo-600 uppercase font-sans">
                Chủ đề: {currentScenario.topic}
              </span>
            </div>

            {/* Scenario Story content */}
            <div className="bg-slate-50/55 p-4 rounded-xl border border-slate-150 text-[1.1rem] text-slate-700 leading-relaxed font-normal mb-6 max-h-[220px] overflow-y-auto">
              <strong className="text-slate-800 block mb-1">Mô tả tình huống:</strong>
              {currentScenario.scenarioText}
            </div>

            {/* Stepped Evaluation structure */}
            <div className="space-y-6">
              
              {/* Step 1: Determine Risk (3 points) */}
              <div className="border border-slate-100 rounded-xl p-4 bg-white hover:shadow-sm duration-100">
                <h4 className="text-[1.1rem] font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <span className="w-5 h-5 text-xs bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-mono">1</span>
                  <span className="flex-1">{currentScenario.step1.prompt}</span> <span className="text-xs font-semibold text-indigo-500 font-mono shrink-0">(3 điểm)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 font-medium">
                  {currentScenario.step1.choices.map((c) => {
                    const isSelected = valueSelectedB1 === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleSelectB(currentScenario.id, 'step1', c.id)}
                        className={`p-3 rounded-lg border text-left text-[1.0rem] leading-normal flex items-start gap-2.5 cursor-pointer transition-colors ${isSelected ? 'border-indigo-600 bg-indigo-50/20 text-indigo-900 font-semibold' : 'border-slate-150 hover:bg-slate-50 text-slate-600'}`}
                      >
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200 bg-slate-50'}`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <span>{c.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Choose action (3 points) */}
              <div className={`border border-slate-100 rounded-xl p-4 bg-white hover:shadow-sm duration-100 ${!valueSelectedB1 ? 'opacity-50 pointer-events-none' : ''}`}>
                <h4 className="text-[1.1rem] font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <span className="w-5 h-5 text-xs bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-mono">2</span>
                  <span className="flex-1">{currentScenario.step2.prompt}</span> <span className="text-xs font-semibold text-indigo-500 font-mono shrink-0">(3 điểm)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 font-medium">
                  {currentScenario.step2.choices.map((c) => {
                    const isSelected = valueSelectedB2 === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleSelectB(currentScenario.id, 'step2', c.id)}
                        className={`p-3 rounded-lg border text-left text-[1.0rem] leading-normal flex items-start gap-2.5 cursor-pointer transition-colors ${isSelected ? 'border-indigo-600 bg-indigo-50/20 text-indigo-900 font-semibold' : 'border-slate-150 hover:bg-slate-50 text-slate-600'}`}
                      >
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200 bg-slate-50'}`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <span>{c.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Explain rationale (2 points) */}
              <div className={`border border-slate-100 rounded-xl p-4 bg-white hover:shadow-sm duration-100 ${!valueSelectedB2 ? 'opacity-50 pointer-events-none' : ''}`}>
                <h4 className="text-[1.1rem] font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <span className="w-5 h-5 text-xs bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-mono">3</span>
                  <span className="flex-1">{currentScenario.step3.prompt}</span> <span className="text-xs font-semibold text-indigo-500 font-mono shrink-0">(2 điểm)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 font-medium">
                  {currentScenario.step3.choices.map((c) => {
                    const isSelected = valueSelectedB3 === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleSelectB(currentScenario.id, 'step3', c.id)}
                        className={`p-3 rounded-lg border text-left text-[1.0rem] leading-normal flex items-start gap-2.5 cursor-pointer transition-colors ${isSelected ? 'border-indigo-600 bg-indigo-50/20 text-indigo-900 font-semibold' : 'border-slate-150 hover:bg-slate-50 text-slate-600'}`}
                      >
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200 bg-slate-50'}`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <span>{c.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        ) : null}

        {/* Stepper buttons below card */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-8">
          <button
            disabled={activeQuestionIdx === 0}
            onClick={() => setActiveQuestionIdx(prev => prev - 1)}
            className="px-4 py-2 border border-slate-200 hover:border-slate-350 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lui
          </button>

          <span className="text-xs text-slate-400 font-semibold font-sans">
            Câu {activeQuestionIdx + 1} / {activePart === 'A' ? 20 : 5}
          </span>

          <button
            disabled={activeQuestionIdx === (activePart === 'A' ? 19 : 4)}
            onClick={() => setActiveQuestionIdx(prev => prev + 1)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-350 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            Tiếp theo
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Layout: Progress sidebar panel indicating status of answers */}
      <div className="lg:col-span-1 space-y-6" id="exam-right-sidebar">
        
        {/* Toggle Part selector tabs */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex shadow-sm gap-2 text-xs font-bold">
          <button
            onClick={() => {
              setActivePart('A');
              setActiveQuestionIdx(0);
            }}
            className={`flex-1 py-2 rounded-lg text-center cursor-pointer transition-colors ${activePart === 'A' ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            A: Trắc nghiệm
          </button>
          <button
            onClick={() => {
              setActivePart('B');
              setActiveQuestionIdx(0);
            }}
            className={`flex-1 py-2 rounded-lg text-center cursor-pointer transition-colors ${activePart === 'B' ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            B: Tình huống
          </button>
        </div>

        {/* Matrix indicators of completed questions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 
            className="font-bold uppercase tracking-wider mb-4 font-sans text-[12px] text-center text-[#09387a]"
            style={{ marginLeft: '-5px', marginRight: '-5px' }}
          >
            Tiến độ hoàn thành bài thi
          </h3>

          {activePart === 'A' ? (
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isSelected = !!answers.partA[q.id];
                const isActive = activePart === 'A' && activeQuestionIdx === idx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionIdx(idx)}
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center font-mono font-bold text-[11px] cursor-pointer duration-100 ${isActive ? 'bg-blue-700 text-white border-blue-700 scale-105' : isSelected ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {scenarios.map((s, idx) => {
                const resp = answers.partB[s.id] || { step1: '', step2: '', step3: '' };
                const stepsCompleted = (resp.step1 ? 1 : 0) + (resp.step2 ? 1 : 0) + (resp.step3 ? 1 : 0);
                const isActive = activePart === 'B' && activeQuestionIdx === idx;
                
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveQuestionIdx(idx)}
                    className={`w-full p-2.5 rounded-xl border text-left cursor-pointer flex items-center justify-between duration-100 ${isActive ? 'bg-blue-700 text-white border-blue-700' : 'bg-slate-50 border-slate-250 hover:bg-slate-100'}`}
                  >
                    <span className="text-[11px] font-bold">Kịch bản {idx + 1}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-600 text-blue-100' : stepsCompleted === 3 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                      {stepsCompleted}/3 bước
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Guidelines */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-[13px] text-slate-550">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-slate-100 border border-slate-300 rounded shrink-0"></span>
              <span>Chưa làm</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-50 border border-emerald-200 rounded shrink-0"></span>
              <span>Đã chọn phương án</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-blue-700 rounded shrink-0"></span>
              <span>Câu đang hiển thị</span>
            </div>
          </div>
        </div>

        {/* Dynamic Warning Alert Box */}
        {tabSwitchCount > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl shadow-sm space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-700">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 animate-bounce" />
              CẢNH BÁO PHÁP QUY
            </div>
            <p className="text-[10px] leading-relaxed font-normal">
              Đồng chí đã chuyển tab làm việc <strong>{tabSwitchCount} lần</strong>. Mọi thao tác rời khỏi màn hình thi đều bị giám sát và lưu trữ khẩn cấp. Vượt quá 3 lần có thể bị Ban chỉ huy hủy kết quả!
            </p>
          </div>
        )}
      </div>

      {/* MODAL FRAUD WARNING WINDOW OVERLAY */}
      {showCheatOverlay && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-[60] animate-fade-in" id="cheat-alert-modal">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            <div className="w-14 h-14 bg-red-100 border border-red-200 text-red-600 rounded-full flex items-center justify-center mx-auto ring-glow">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-tight">
              Phát hiện Chuyển ranh giới!
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Mọi hành vi thoát màn hình làm việc để tra cứu tài liệu đều vi phạm nghiêm túc thể lệ phòng thi an ninh mạng. Nhật ký vi phạm sẽ được gửi trực tiếp về server và lưu tên của đồng chí.
            </p>

            <div className="p-3 bg-red-50 border border-red-105 text-red-700 text-xs font-bold rounded-xl">
              Số lần dời màn hình: {tabSwitchCount} / 3 lần cảnh cáo
            </div>

            <button
              onClick={() => setShowCheatOverlay(false)}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl uppercase tracking-wider cursor-pointer duration-100 shadow"
            >
              Tôi đã hiểu và Cam kết Làm bài Trung thực
            </button>
          </div>
        </div>
      )}

      {/* CUSTOM SUBMIT EXAM CONFIRMATION MODAL */}
      {showSubmitModal && (() => {
        const unansweredA = questions.filter(q => !answers.partA[q.id]).length;
        const unansweredB = scenarios.filter(s => {
          const resp = answers.partB[s.id];
          return !resp || !resp.step1 || !resp.step2 || !resp.step3;
        }).length;
        const totalUnanswered = unansweredA + unansweredB;

        return (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-fade-in" id="submit-confirm-modal">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center space-y-5 shadow-2xl">
              <div className="w-14 h-14 bg-amber-100 border border-amber-200 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-tight">
                Xác nhận nộp bài thi!
              </h3>

              {totalUnanswered > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs text-red-600 leading-relaxed font-semibold">
                    Cảnh báo: Đồng chí còn {unansweredA} câu hỏi trắc nghiệm và {unansweredB} tình huống chưa giải quyết xong!
                  </p>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Nếu nộp bài lúc này, hệ thống sẽ tính điểm dựa trên phần bài làm đã nộp. Các câu chưa chọn sẽ không được tính điểm.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 leading-relaxed">
                  Đồng chí đã trả lời đầy đủ tất cả các câu hỏi trắc nghiệm và câu hỏi kịch bản tình huống.
                </p>
              )}

              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                Đồng chí có chắc chắn lựa chọn nộp bài và kết thúc lượt thi này ngay bây giờ?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer duration-100 border border-slate-250"
                >
                  Làm tiếp
                </button>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    submitExam();
                  }}
                  className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl uppercase tracking-wider cursor-pointer duration-100 shadow"
                >
                  Nộp bài thi
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      </div>
    </div>
  );
}
