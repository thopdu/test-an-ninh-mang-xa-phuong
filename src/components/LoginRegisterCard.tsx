/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, User, Building, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

interface LoginRegisterCardProps {
  onLoginSuccess: (token: string, user: any) => void;
}

export default function LoginRegisterCard({ onLoginSuccess }: LoginRegisterCardProps) {
  // Authentication Modes:
  // 'gmail_input': Enter Gmail email
  // 'gmail_register': User is logging in for first time with Gmail, needs fullName & department
  // 'admin_login': Standard admin username/password login
  const [authMode, setAuthMode] = useState<'gmail_input' | 'gmail_register' | 'admin_login'>('gmail_input');
  
  const [departments, setDepartments] = useState<string[]>([]);
  const [gmail, setGmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  
  // Administrator fields
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/departments')
      .then(res => res.json())
      .then(data => {
        setDepartments(data);
        if (data.length > 0) setDepartment(data[0]);
      })
      .catch(err => console.error("Could not load departments", err));
  }, []);

  // Handler for Gmail Step 1: Input Gmail & Check Existence
  const handleGmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const emailNorm = gmail.trim().toLowerCase();
    if (!emailNorm) {
      setError('Vui lòng điền địa chỉ Gmail.');
      return;
    }

    if (!emailNorm.endsWith('@gmail.com') && emailNorm !== 'pvantho@pdu.edu.vn') {
      setError('Hệ thống chỉ hỗ trợ hòm thư @gmail.com hoặc hòm thư công vụ pvantho@pdu.edu.vn.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/check-gmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailNorm })
      });

      const checkData = await response.json();
      if (!response.ok) {
        throw new Error(checkData.error || 'Lỗi kiểm tra hòm thư Gmail.');
      }

      if (checkData.exists) {
        // Direct passwordless login!
        const loginRes = await fetch('/api/auth/gmail-login-direct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailNorm })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) {
          throw new Error(loginData.error || 'Đăng nhập Gmail thất bại.');
        }
        onLoginSuccess(loginData.token, loginData.user);
      } else {
        // Redirect to register details (Họ tên & Xã phường)
        setAuthMode('gmail_register');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler for Gmail Step 2: Register user details on first login
  const handleGmailRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Vui lòng nhập Họ tên cán bộ công tác.');
      return;
    }

    if (!department) {
      setError('Vui lòng chọn xã/phường công tác.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/gmail-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: gmail.trim().toLowerCase(),
          fullName: fullName.trim(),
          department
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Không thể ghi nhận thông tin đăng ký.');
      }

      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler for Administrator credential authentication
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!adminUsername.trim() || !adminPassword.trim()) {
      setError('Vui lòng điền tên quản trị và mật mã.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: adminUsername.trim(),
          password: adminPassword
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Tên đăng nhập hoặc mật khẩu quản trị viên không chính xác.');
      }

      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden" id="login-card-container">
      {/* Top Banner & Crest */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 px-6 py-8 text-center text-white relative border-b border-indigo-900/35">
        
        {/* Real Generated App Icon Card Top Crest */}
        <div className="w-16 h-16 bg-white rounded-full overflow-hidden flex items-center justify-center p-1 mx-auto mb-4 shadow-lg border border-slate-200/40">
          <img 
            src="/src/assets/images/app_logo_1781355779193.jpg" 
            alt="Logo" 
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>

        <h2 className="text-[11.5px] font-extrabold tracking-wider leading-snug uppercase text-amber-400 select-all">
          Chương trình tập huấn kỹ năng công nghệ số
        </h2>
        <h1 className="text-base sm:text-lg font-black text-white mt-1.5 uppercase tracking-tight leading-snug select-all">
          Khảo sát nhận thức An toàn thông tin mạng
        </h1>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-150 text-red-700 text-xs rounded-lg font-sans font-medium">
            {error}
          </div>
        )}

        {/* MODE 1: Input Gmail */}
        {authMode === 'gmail_input' && (
          <form onSubmit={handleGmailSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Đăng nhập bằng email cá nhân
              </label>
              <p className="text-[11px] text-slate-500 mb-2 leading-normal">
                Nhập email cá nhân để bắt đầu. Hệ thống sẽ tự động xác thực và dẫn dắt đăng ký nếu là lần đầu.
              </p>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  type="email"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-colors font-medium text-slate-850"
                  placeholder="Ví dụ: canbocoso@gmail.com"
                  value={gmail}
                  onChange={e => setGmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-150 shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {loading ? 'Đang xác thực hòm thư...' : (
                <>
                  Đăng nhập qua Gmail
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* MODE 2: First-time Register Profile Details */}
        {authMode === 'gmail_register' && (
          <form onSubmit={handleGmailRegisterSubmit} className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-[11px] text-amber-800 leading-snug">
              🔔 **Đồng chí đăng nhập lần đầu!** Vui lòng hoàn thành điền các thông tin hành chính xác minh dưới đây để hệ thống lưu hồ sơ phục vụ cấp báo cáo học tập.
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa chỉ Gmail liên kết
                </label>
                <input
                  type="text"
                  disabled
                  className="w-full px-3 py-2 text-sm bg-slate-100 text-slate-500 border border-slate-200 rounded-lg cursor-not-allowed font-medium font-mono"
                  value={gmail}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên cán bộ (Họ và tên)
                </label>
                <div className="relative font-medium">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 font-medium"
                    placeholder="Ví dụ: Nguyễn Văn Hải"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đơn vị, Xã / Phường công tác
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Building className="w-4 h-4" />
                  </span>
                  <select
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 cursor-pointer appearance-none font-medium"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                  >
                    {departments.map(dep => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setAuthMode('gmail_input');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1 border border-slate-200/50"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Quay lại
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
              >
                {loading ? 'Đang tạo dữ liệu...' : 'Hoàn tất Đăng ký & Vào thi'}
              </button>
            </div>
          </form>
        )}

        {/* MODE 3: Administrator Username/Password standard login */}
        {authMode === 'admin_login' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-1">
              <span>🔒 ĐĂNG NHẬP BAN GIÁM KHẢO / QUẢN TRỊ VIÊN</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tài khoản ID Quản trị
              </label>
              <div className="relative font-medium">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-650"
                  placeholder="Ví dụ: admin"
                  value={adminUsername}
                  onChange={e => setAdminUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mật khẩu Quản lý
              </label>
              <div className="relative font-medium">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-650"
                  placeholder="Mật khẩu sở chỉ huy"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                />
              </div>
              <span className="text-[10px] text-slate-400 italic mt-1 block">
                Tài khoản mặc chế: <strong className="text-slate-600 font-mono">admin</strong> / <strong className="text-slate-600 font-mono">admin123</strong>.
              </span>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setAuthMode('gmail_input');
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer flex items-center gap-1 border border-slate-200/50"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Về Gmail
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-700 hover:bg-red-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
              >
                {loading ? 'Đang kiểm xác...' : 'Đăng nhập Quản trị'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
