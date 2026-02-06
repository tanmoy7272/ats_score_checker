import React from 'react';

const ScoreCircle = ({ score }) => {
  const color = score >= 75 ? 'bg-emerald-600' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="flex items-center justify-center">
      <div className={`rounded-full ${color} text-white flex items-center justify-center shadow-xl`} style={{ width: 140, height: 140 }}>
        <div className="text-center">
          <div className="text-4xl font-extrabold">{Math.round(score)}%</div>
          <div className="text-xs mt-1 opacity-90">Compatibility</div>
        </div>
      </div>
    </div>
  );
};

const ScoreSummary = ({ score, breakdown }) => {
  const totalParams = Object.keys(breakdown).length;
  const matchedCount = Object.values(breakdown).filter(p => p.match > 0).length;
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center gap-4">
      <ScoreCircle score={score} />
      <div className="text-sm font-semibold">Matched Parameters: <span className="text-indigo-600">{matchedCount} / {totalParams}</span></div>
      <div className="text-xs text-slate-500">Weighted Score: <span className="font-medium">{Math.round(score)}%</span></div>
      <div className="text-xs text-slate-400 text-center">Score calculated from deterministic rule engine using above parameters</div>
    </div>
  );
};

export default ScoreSummary;
