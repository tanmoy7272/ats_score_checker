import React from 'react';

const DashboardHeader = ({ score = 0, breakdown = {} }) => {
  const scoreColor = score >= 75 ? 'bg-emerald-600' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500';
  const totalParams = Object.keys(breakdown).length;
  const matchedCount = Object.values(breakdown).filter(p => p.match > 0).length;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Overall Score</h3>
          <p className="text-slate-600 text-sm">Weighted score across all parameters</p>
        </div>
        <div className="flex items-center gap-12">
          <div className={`rounded-full ${scoreColor} text-white flex items-center justify-center shadow-lg`} style={{ width: 140, height: 140 }}>
            <div className="text-center">
              <div className="text-4xl font-extrabold">{Math.round(score)}%</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-900">{matchedCount}<span className="text-xl text-slate-500">/{totalParams}</span></div>
            <p className="text-sm text-slate-600 mt-1">Parameters Matched</p>
            <p className="text-xs text-slate-400 mt-3">Green ✓: Full match</p>
            <p className="text-xs text-slate-400">Yellow ◐: Partial match</p>
            <p className="text-xs text-slate-400">Red ✗: No match</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
