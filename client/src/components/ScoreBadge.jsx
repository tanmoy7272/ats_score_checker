import React from 'react';

const ScoreBadge = ({ score }) => {
  const color = score >= 75 ? 'bg-emerald-600' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="flex items-center justify-center">
      <div className={`rounded-full ${color} text-white flex items-center justify-center shadow-xl`} style={{ width: 140, height: 140 }}>
        <div className="text-center">
          <div className="text-5xl font-extrabold">{Math.round(score)}%</div>
          <div className="text-xs mt-1 opacity-90">Compatibility</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBadge;
