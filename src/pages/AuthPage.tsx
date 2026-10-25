import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (isRegister) {
      if (!displayName.trim()) {
        setErrorMessage('আপনার নাম প্রদান করুন');
        setLoading(false);
        return;
      }
      const res = await register(displayName, email, password);
      if (res.success) {
        navigate('/my-quran');
      } else {
        setErrorMessage(res.error || 'নিবন্ধন ব্যর্থ হয়েছে');
      }
    } else {
      const res = await login(email, password);
      if (res.success) {
        navigate('/my-quran');
      } else {
        setErrorMessage(res.error || 'লগইন ব্যর্থ হয়েছে');
      }
    }
    setLoading(false);
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    await login(demoEmail, 'password123');
    setLoading(false);
    navigate('/my-quran');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] dark:bg-[#111C19] text-[#111C19] dark:text-[#FAF8F2] flex items-center justify-center p-4 pb-24 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-[#162622] rounded-3xl shadow-xl border border-[#B38A42]/30 p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B3D32] to-[#162622] border border-[#B38A42]/40 text-[#DFC186] flex items-center justify-center mx-auto shadow-md font-quran text-2xl font-bold">
            ن
          </div>
          <h1 className="text-2xl font-bold font-bengali text-[#0B3D32] dark:text-[#DFC186]">
            {isRegister ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'অ্যাকাউন্টে প্রবেশ করুন'}
          </h1>
          <p className="text-xs text-gray-500 font-bengali">
            বুকমার্কস এবং পঠিত অগ্রগতি ক্লাউডে সংরক্ষণ ও সিঙ্ক করুন
          </p>
        </div>

        {/* Free Quran Reading Reminder */}
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-bengali flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#B38A42] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            স্মরণীয়: কুরআন তিলাওয়াত ও অধ্যয়নের জন্য কোনো অ্যাকাউন্ট বা লগইনের প্রয়োজন নেই; প্ল্যাটফর্মটি সবার জন্য উন্মুক্ত।
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-bengali flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-bengali">
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                আপনার পূর্ণ নাম
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="যেমন: আহমদ হাসান"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#B38A42]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              ইমেইল ঠিকানা
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#B38A42]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৬টি অক্ষর"
                required
                minLength={6}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#B38A42]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0B3D32] hover:bg-[#115545] text-white font-semibold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isRegister ? 'নিবন্ধন সম্পন্ন করুন' : 'প্রবেশ করুন'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <p className="text-[11px] text-center text-gray-400 font-bengali">
            পরীক্ষামূলক দ্রুত প্রবেশ (Demo Instant Sign-in):
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-bengali">
            <button
              type="button"
              onClick={() => handleDemoLogin('reader@noorquran.app')}
              className="py-1.5 px-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer"
            >
              সাধারণ পাঠক (User)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@noorquran.app')}
              className="py-1.5 px-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-950 text-[#B38A42] border border-[#B38A42]/30 transition-colors cursor-pointer"
            >
              প্রশাসক (Admin)
            </button>
          </div>
        </div>

        {/* Switch tab */}
        <div className="text-center pt-2 text-xs font-bengali text-gray-500">
          {isRegister ? (
            <p>
              ইতোমধ্যে অ্যাকাউন্ট আছে?{' '}
              <button
                onClick={() => { setIsRegister(false); setErrorMessage(''); }}
                className="text-[#B38A42] font-semibold hover:underline cursor-pointer"
              >
                লগইন করুন
              </button>
            </p>
          ) : (
            <p>
              নতুন ব্যবহারকারী?{' '}
              <button
                onClick={() => { setIsRegister(true); setErrorMessage(''); }}
                className="text-[#B38A42] font-semibold hover:underline cursor-pointer"
              >
                বিনামূল্যে অ্যাকাউন্ট খুলুন
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
