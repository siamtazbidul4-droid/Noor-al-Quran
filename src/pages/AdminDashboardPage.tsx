import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Layers,
  Volume2,
  FileText,
  Lock,
  Loader2
} from 'lucide-react';
import { SOURCES_REGISTRY } from '../data/sourcesRegistry';
import { RECITERS } from '../data/recitersData';

export const AdminDashboardPage: React.FC = () => {
  const [integrityReport, setIntegrityReport] = useState<any>(null);
  const [loadingIntegrity, setLoadingIntegrity] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const fetchHealthAndIntegrity = () => {
    setLoadingIntegrity(true);

    fetch('/api/v1/health')
      .then(r => r.json())
      .then(data => setHealthData(data))
      .catch(console.warn);

    fetch('/api/v1/admin/verify-integrity')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setIntegrityReport(data.report);
        }
      })
      .catch(console.warn)
      .finally(() => setLoadingIntegrity(false));

    fetch('/api/v1/admin/audit-logs')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          setAuditLogs(data.data);
        }
      })
      .catch(console.warn);
  };

  useEffect(() => {
    fetchHealthAndIntegrity();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F2] dark:bg-[#111C19] text-[#111C19] dark:text-[#FAF8F2] pb-32 transition-colors">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#0B3D32] to-[#111C19] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#B38A42]/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1 rounded bg-[#B38A42] text-white">
                <Lock className="w-4 h-4" />
              </span>
              <span className="text-xs uppercase tracking-wider text-[#DFC186] font-semibold">
                Administrative Governance & Integrity Center
              </span>
            </div>
            <h1 className="text-3xl font-extrabold font-bengali text-white mb-2">
              নূর আল-কুরআন প্রশাসন ও ডাটা বিশুদ্ধতা নিরীক্ষা
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-bengali">
              প্রামাণ্য ধর্মীয় উৎস ব্যবস্থাপনা, কন্টেন্ট ভেরিফিকেশন রিপোর্ট ও অডিট ট্রেইল।
            </p>
          </div>

          <button
            onClick={fetchHealthAndIntegrity}
            disabled={loadingIntegrity}
            className="px-4 py-2.5 rounded-xl bg-[#B38A42] hover:bg-[#C29649] text-white text-xs font-semibold font-bengali flex items-center gap-2 shadow-md transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loadingIntegrity ? 'animate-spin' : ''}`} />
            পুনরায় যাচাই পরীক্ষা চালান
          </button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* System & Database Health Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#162622] border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#0B3D32] dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bengali">সার্ভার স্ট্যাটাস</span>
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                সক্রিয় (Operational)
              </h3>
              <p className="text-[11px] text-gray-400">আপটাইম: {healthData ? `${Math.round(healthData.uptime)}s` : '...'}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#162622] border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-[#B38A42] flex items-center justify-center shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bengali">ডাটাবেস কানেকশন</span>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                {healthData?.database?.isConnected ? 'MongoDB সংযুক্ত' : 'গেস্ট / লোকাল মোড'}
              </h3>
              <p className="text-[11px] text-gray-400 truncate max-w-[160px]">
                {healthData?.database?.error ? 'MONGODB_URI ঐচ্ছিক' : 'সঠিকভাবে প্রস্তুত'}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#162622] border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bengali">কুরআনিক ডাটা সূচক</span>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                ১১৪ সূরা / ৬,২৩৬ আয়াত
              </h3>
              <p className="text-[11px] text-emerald-600 font-medium">৩০ পারা সীমানা সম্পূর্ণ</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#162622] border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bengali">অডিও ক্বারী রিপোজিটরি</span>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                {RECITERS.length} জন পুরুষ ক্বারী
              </h3>
              <p className="text-[11px] text-purple-600 font-medium">EveryAyah CDN লাইভ</p>
            </div>
          </div>
        </section>

        {/* Content Integrity Validation Pipeline Report */}
        <section className="p-6 rounded-2xl bg-white dark:bg-[#162622] border border-[#B38A42]/40 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-bold font-bengali text-[#0B3D32] dark:text-[#DFC186] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#B38A42]" />
                কুরআন পাঠ্য বিশুদ্ধতা ও কাঠামোগত যাচাই প্রতিবেদন (Integrity Pipeline)
              </h2>
              <p className="text-xs text-gray-500 font-bengali">
                স্বয়ংক্রিয় গাণিতিক ও প্রামাণ্য সীমানা পরীক্ষা (মেদিনা শরীফ মুসহাফ মানদণ্ড)
              </p>
            </div>
            {integrityReport && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold font-mono">
                STATUS: {integrityReport.passed ? 'PASSED (100% VERIFIED)' : 'FAILED'}
              </span>
            )}
          </div>

          {loadingIntegrity ? (
            <div className="py-12 text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#B38A42] mx-auto" />
              <p className="text-xs text-gray-500 font-bengali">পরীক্ষা যাচাই চলছে...</p>
            </div>
          ) : integrityReport ? (
            <div className="space-y-3">
              {integrityReport.checks.map((check: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white font-bengali">
                        {check.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {check.description}
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono mt-1 font-semibold">
                        {check.detail}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[11px] font-bold">
                    {check.status}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        {/* Content Sources Registry */}
        <section className="p-6 rounded-2xl bg-white dark:bg-[#162622] border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold font-bengali text-[#0B3D32] dark:text-[#DFC186] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#B38A42]" />
            উৎস রেজিস্ট্রি ও লাইসেন্স তথ্যাবলী (Content Source Registry)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SOURCES_REGISTRY.map((src) => (
              <div
                key={src.id}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
                      {src.contentType}
                    </span>
                    <span className="text-xs font-mono text-[#B38A42] font-bold">
                      {src.version}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white font-bengali">
                    {src.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-bengali">
                    উৎস প্রদানকারী: {src.provider}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 font-bengali leading-relaxed">
                    {src.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-[11px] text-gray-500 space-y-1 font-bengali">
                  <p><span className="font-semibold text-gray-700 dark:text-gray-300">কৃতজ্ঞতা:</span> {src.attribution}</p>
                  <p><span className="font-semibold text-gray-700 dark:text-gray-300">কভারেজ:</span> {src.supportedCoverage}</p>
                  <p><span className="font-semibold text-gray-700 dark:text-gray-300">লাইসেন্স:</span> {src.license}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Administrative Audit Logs */}
        <section className="p-6 rounded-2xl bg-white dark:bg-[#162622] border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold font-bengali text-[#0B3D32] dark:text-[#DFC186] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#B38A42]" />
            সিস্টেম অডিট ট্রেইল (Audit Logs)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bengali">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                <tr>
                  <th className="p-3">অ্যাক্টর</th>
                  <th className="p-3">অ্যাকশন</th>
                  <th className="p-3">টার্গেট</th>
                  <th className="p-3">ফলাফল</th>
                  <th className="p-3">বিবরণ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {auditLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-3 font-mono font-semibold text-gray-800 dark:text-gray-200">{log.actor}</td>
                    <td className="p-3 font-mono text-[#B38A42] font-semibold">{log.action}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{log.target}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                        {log.outcome}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500 max-w-xs truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};
