/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckCircle, XCircle, ChevronLeft, Award, BookOpen, 
  CornerDownRight, Printer, RefreshCw, Sparkles, ShieldCheck
} from 'lucide-react';
import { ExamAttempt } from '../types';

interface ExamReviewViewProps {
  attemptData: {
    score: number;
    grade: string;
    gradedDetails: {
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
        totalPoints: number;
      }[];
    };
  };
  attemptNumber: number;
  userFullName: string;
  userDepartment: string;
  onBackToDashboard: () => void;
}

export default function ExamReviewView({
  attemptData,
  attemptNumber,
  userFullName,
  userDepartment,
  onBackToDashboard
}: ExamReviewViewProps) {
  const [activeReviewTab, setActiveReviewTab] = useState<'A' | 'B'>('A');

  const printCertificate = () => {
    window.print();
  };

  const gradeBadgeColor = (grade: string) => {
    switch (grade) {
      case "Xuất sắc": return "border-emerald-250 bg-emerald-50 text-emerald-800";
      case "Giỏi": return "border-teal-250 bg-teal-50 text-teal-800";
      case "Khá": return "border-blue-250 bg-blue-50 text-blue-800";
      case "Đạt": return "border-amber-250 bg-amber-50 text-amber-800";
      default: return "border-red-250 bg-red-50 text-red-800";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6" id="exam-review-panel">
      {/* Back Button */}
      <button
        onClick={onBackToDashboard}
        className="px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer duration-100 shadow-sm print:hidden"
      >
        <ChevronLeft className="w-4 h-4" />
        Thoát chế độ xem & Quay lại Bảng điều khiển
      </button>

      {/* Grid: Certificate + Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
        
        {/* Certificate Display */}
        <div className="md:col-span-3 bg-gradient-to-tr from-amber-50/50 to-orange-50/20 border-2 border-dashed border-amber-200 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-sm">
          {/* Decorative stamp graphic */}
          <div className="absolute right-6 bottom-6 w-24 h-24 rounded-full border-4 border-red-500/10 flex items-center justify-center text-red-500/10 font-bold uppercase tracking-widest text-[9px] select-none rotate-12">
            Ủy ban Nhân dân
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider font-mono">
                BẢN GHI ĐÁNH GIÁ CÔNG CHỨC
              </span>
              <ShieldCheck className="w-6 h-6 text-amber-600" />
            </div>

            <h1 className="text-sm font-black text-slate-800">
              CHỨNG NHẬN KẾT QUẢ SÁT HẠCH
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">
              An toàn & Bảo mật thông tin trên nền tảng số 2026
            </p>

            <div className="mt-6 space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-normal">Họ và tên Cán bộ:</span>
                <strong className="text-slate-800 ml-2">{userFullName}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-normal">Đơn vị công tác:</span>
                <strong className="text-slate-800 ml-2">{userDepartment}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-normal">Phân loại Đánh giá:</span>
                <span className={`ml-2 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${gradeBadgeColor(attemptData.grade)}`}>
                  {attemptData.grade}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Hệ thống Cổng Dịch Vụ Công Bộ Nội Vụ</span>
            <button
              onClick={printCertificate}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold cursor-pointer transition-colors flex items-center gap-1.1 shadow-sm print:hidden"
            >
              <Printer className="w-3.5 h-3.5" />
              In kết quả
            </button>
          </div>
        </div>

        {/* Score Ring / Block */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between text-center">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              Đạt điểm số
            </h3>
            <div className="text-6xl font-black text-blue-700 font-sans tracking-tighter my-4">
              {attemptData.score}
              <span className="text-xs text-slate-400 font-normal tracking-normal ml-0.5">/100đ</span>
            </div>
            
            <p className="text-xs text-slate-500 font-normal px-2">
              Lượt sát hạch thứ <strong>{attemptNumber}</strong>. Điểm thi chính thức của đồng chí sẽ được lấy theo mốc cao nhất trong 5 lần thi.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-around text-xs">
            <div>
              <span className="text-slate-400 block font-normal text-[10px]">Trắc nghiệm</span>
              <strong className="text-slate-700 font-sans">{attemptData.gradedDetails?.partA?.reduce((a, b) => a + b.points, 0) || 0} / 60 đ</strong>
            </div>
            <div className="w-px h-6 bg-slate-150"></div>
            <div>
              <span className="text-slate-400 block font-normal text-[10px]">Tình huống</span>
              <strong className="text-slate-700 font-sans">{attemptData.gradedDetails?.partB?.reduce((a, b) => a + b.totalPoints, 0) || 0} / 40 đ</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Selector Part tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex shadow-sm gap-2 text-xs font-bold print:hidden">
        <button
          onClick={() => setActiveReviewTab('A')}
          className={`flex-1 py-2.5 rounded-lg text-center cursor-pointer transition-all ${activeReviewTab === 'A' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Đáp án Chuyên đề A: Trắc nghiệm khách quan
        </button>
        <button
          onClick={() => setActiveReviewTab('B')}
          className={`flex-1 py-2.5 rounded-lg text-center cursor-pointer transition-all ${activeReviewTab === 'B' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Đáp án Chuyên đề B: Thiết lập phương án Tình huống
        </button>
      </div>

      {/* Evaluated Details panels */}
      <div className="space-y-4">
        {activeReviewTab === 'A' ? (
          attemptData.gradedDetails?.partA?.map((det, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-1.5 w-24 bg-blue-600"></div>
              
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-400 font-mono">Câu {idx + 1}</span>
                <span className={`font-bold px-2.5 py-0.5 rounded-full ${det.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : (det.chosenAnswer === 'Không trả lời' || !det.chosenAnswer) ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {det.isCorrect ? '+3 điểm (Chính xác)' : (det.chosenAnswer === 'Không trả lời' || !det.chosenAnswer) ? '0 điểm (Chưa làm)' : '0 điểm (Chưa đúng)'}
                </span>
              </div>

              <h4 className="text-[1rem] font-bold text-slate-800 leading-normal font-sans">
                {det.questionText}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className={`p-3 rounded-xl border ${det.isCorrect ? 'bg-emerald-50/20 border-emerald-150' : (det.chosenAnswer === 'Không trả lời' || !det.chosenAnswer) ? 'bg-slate-50/50 border-slate-200' : 'bg-red-50/20 border-red-150'}`}>
                  <span className="text-[10px] text-slate-400 block font-normal">Lựa chọn của đồng chí:</span>
                  <strong className={`block mt-1 font-sans ${det.isCorrect ? 'text-emerald-700' : (det.chosenAnswer === 'Không trả lời' || !det.chosenAnswer) ? 'text-slate-500 italic font-normal' : 'text-red-700'}`}>
                    {det.chosenAnswer}
                  </strong>
                </div>
                <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-150">
                  <span className="text-[10px] text-emerald-600 block font-normal">Đáp án chuẩn quốc gia:</span>
                  <strong className="block mt-1 text-emerald-800 font-sans">
                    {det.correctAnswer}
                  </strong>
                </div>
              </div>

              {/* Justification citation / comment */}
              <div className="p-3 bg-blue-50/45 border border-blue-100 rounded-xl text-blue-800 text-xs">
                <span className="font-bold flex items-center gap-1 mb-1 text-blue-900 leading-none">
                  <Sparkles className="w-3.5 h-3.5" />
                  Luật & Định mức hỗ trợ cán bộ cơ sở:
                </span>
                <p className="font-normal text-[11px] leading-relaxed">
                  {det.explanation}
                </p>
              </div>
            </div>
          ))
        ) : (
          attemptData.gradedDetails?.partB?.map((det, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-1.5 w-24 bg-purple-600"></div>

              <div className="flex items-center justify-between text-[11px]">
                <div>
                  <span className="font-bold text-slate-400">Kịch bản {idx + 1}: </span>
                  <strong className="text-purple-700 font-bold uppercase">{det.topic}</strong>
                </div>
                <span className="font-bold text-xs text-slate-800 font-sans">
                  Điểm số đạt: <strong className="text-blue-700 font-extrabold">{det.totalPoints} / 8 đ</strong>
                </span>
              </div>

              {/* Story */}
              <p className="text-xs text-slate-500 font-normal leading-relaxed border-l-2 border-slate-200 pl-3">
                {det.scenarioText}
              </p>

              {/* Steps assessment */}
              <div className="space-y-3">
                {/* Step 1 */}
                <div className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="text-slate-700">Bước 1: Xác định nguy cơ bảo mật</span>
                    <span className={det.step1.isCorrect ? 'text-emerald-700' : (det.step1.chosen === 'Không trả lời' || !det.step1.chosen) ? 'text-slate-500' : 'text-red-600'}>
                      {det.step1.isCorrect ? '+3 điểm' : (det.step1.chosen === 'Không trả lời' || !det.step1.chosen) ? '0 điểm (Chưa làm)' : '0 điểm'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal italic">{det.step1.prompt}</p>
                  <div className="flex flex-col sm:flex-row gap-1.5 pt-1.5 text-[11px]">
                    <div className="flex-1">Đồng chí chọn: <strong className={det.step1.isCorrect ? 'text-emerald-700' : (det.step1.chosen === 'Không trả lời' || !det.step1.chosen) ? 'text-slate-500 italic font-normal' : 'text-red-700'}>{det.step1.chosen}</strong></div>
                    <div className="flex-1 text-emerald-800 font-semibold">Đáp án đúng: {det.step1.correct}</div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="text-slate-700">Bước 2: Lựa chọn phương án xử lý</span>
                    <span className={det.step2.isCorrect ? 'text-emerald-700' : (det.step2.chosen === 'Không trả lời' || !det.step2.chosen) ? 'text-slate-500' : 'text-red-600'}>
                      {det.step2.isCorrect ? '+3 điểm' : (det.step2.chosen === 'Không trả lời' || !det.step2.chosen) ? '0 điểm (Chưa làm)' : '0 điểm'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal italic">{det.step2.prompt}</p>
                  <div className="flex flex-col sm:flex-row gap-1.5 pt-1.5 text-[11px]">
                    <div className="flex-1">Đồng chí chọn: <strong className={det.step2.isCorrect ? 'text-emerald-700' : (det.step2.chosen === 'Không trả lời' || !det.step2.chosen) ? 'text-slate-500 italic font-normal' : 'text-red-700'}>{det.step2.chosen}</strong></div>
                    <div className="flex-1 text-emerald-800 font-semibold">Đáp án đúng: {det.step2.correct}</div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="text-slate-700">Bước 3: Giải thích lý thuyết lý do xử trí</span>
                    <span className={det.step3.isCorrect ? 'text-emerald-700' : (det.step3.chosen === 'Không trả lời' || !det.step3.chosen) ? 'text-slate-500' : 'text-red-600'}>
                      {det.step3.isCorrect ? '+2 điểm' : (det.step3.chosen === 'Không trả lời' || !det.step3.chosen) ? '0 điểm (Chưa làm)' : '0 điểm'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal italic">{det.step3.prompt}</p>
                  <div className="flex flex-col sm:flex-row gap-1.5 pt-1.5 text-[11px]">
                    <div className="flex-1">Đồng chí chọn: <strong className={det.step3.isCorrect ? 'text-emerald-700' : (det.step3.chosen === 'Không trả lời' || !det.step3.chosen) ? 'text-slate-500 italic font-normal' : 'text-red-700'}>{det.step3.chosen}</strong></div>
                    <div className="flex-1 text-emerald-800 font-semibold">Đáp án đúng: {det.step3.correct}</div>
                  </div>
                </div>
              </div>

              {/* Scenario Explanation */}
              <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl text-purple-900 text-[11px] leading-relaxed font-normal">
                <span className="font-bold block mb-1">Cẩm nang sư phạm tình huống:</span>
                {det.explanation}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
