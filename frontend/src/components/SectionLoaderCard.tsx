import React from 'react';
import { RefreshCw, Clock, Network } from 'lucide-react';

interface SectionLoaderCardProps {
  stageNumber: number;
  title: string;
  subtitle: string;
  status: 'active' | 'queued';
  type: 'bottlenecks' | 'sprint' | 'architecture' | 'commercial';
}

export const SectionLoaderCard: React.FC<SectionLoaderCardProps> = ({
  stageNumber,
  title,
  subtitle,
  status,
  type,
}) => {
  const isActive = status === 'active';

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm transition-all duration-300 relative overflow-hidden ${
        isActive
          ? 'bg-white border-indigo-300 ring-1 ring-indigo-200 shadow-sm'
          : 'bg-white border-slate-200'
      }`}
    >
      {/* Background ambient glow when active */}
      {isActive && (
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-50 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Header status */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
              isActive
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            {isActive ? (
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
            ) : (
              <Clock className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700">
                STAGE {stageNumber} {isActive ? '• IN PROGRESS' : '• QUEUED NEXT'}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h4>
          </div>
        </div>

        <span
          className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${
            isActive
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 animate-pulse font-semibold'
              : 'bg-slate-100 border-slate-200 text-slate-500'
          }`}
        >
          {isActive ? 'Processing...' : 'Awaiting Stage ' + (stageNumber - 1)}
        </span>
      </div>

      <p className="text-xs text-slate-500 mt-3">{subtitle}</p>

      {/* Visual Skeleton representation */}
      <div className="mt-5 space-y-3">
        {type === 'bottlenecks' ? (
          <div className="space-y-3">
            {/* Executive Strip Skeleton */}
            <div className="bg-gradient-to-r from-indigo-50/70 via-slate-50 to-indigo-50/30 border border-indigo-100 rounded-xl p-4 animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-2">
                <div className="w-40 h-4 bg-indigo-200/70 rounded" />
                <div className="w-64 sm:w-96 h-3 bg-slate-200 rounded" />
              </div>
              <div className="w-36 h-8 bg-emerald-100 rounded-xl" />
            </div>

            {/* 3 Bottleneck Card Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 animate-pulse"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-24 h-4 bg-indigo-100 rounded" />
                    <div className="w-16 h-4 bg-emerald-100 rounded" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-full h-3 bg-slate-200 rounded" />
                    <div className="w-5/6 h-3 bg-slate-200 rounded" />
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 space-y-1">
                    <div className="w-16 h-2.5 bg-slate-200 rounded" />
                    <div className="w-full h-2.5 bg-slate-200/70 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : type === 'sprint' ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-4 animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-5 rounded bg-indigo-100" />
                  <div className="w-48 sm:w-64 h-4 rounded bg-slate-200" />
                </div>
                <div className="w-24 h-4 rounded bg-emerald-100 hidden sm:block" />
              </div>
            ))}
          </div>
        ) : type === 'architecture' ? (
          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 min-h-[200px] flex flex-col items-center justify-center gap-4 text-center animate-pulse">
              <Network className="w-8 h-8 text-indigo-400" />
              <div className="space-y-1.5 max-w-sm">
                <div className="w-48 h-4 rounded bg-slate-200 mx-auto" />
                <div className="w-64 h-3 rounded bg-slate-200/80 mx-auto" />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <span className="w-20 h-6 rounded bg-slate-200 border border-slate-300" />
                <span className="w-20 h-6 rounded bg-slate-200 border border-slate-300" />
                <span className="w-20 h-6 rounded bg-slate-200 border border-slate-300" />
              </div>
            </div>
          </div>
        ) : (
          /* Commercial / Pod Matrix Skeleton */
          <div className="space-y-3">
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 animate-pulse flex items-center justify-between">
              <div className="space-y-1">
                <div className="w-36 h-4 bg-indigo-200 rounded" />
                <div className="w-56 h-3 bg-slate-200 rounded" />
              </div>
              <div className="w-28 h-7 bg-emerald-100 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 animate-pulse"
                >
                  <div className="w-28 h-4 bg-slate-200 rounded" />
                  <div className="w-16 h-3 bg-indigo-100 rounded" />
                  <div className="w-full h-2.5 bg-slate-200/70 rounded" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
