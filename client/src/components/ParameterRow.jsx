import React from 'react';
import { CheckIcon, XIcon } from '@heroicons/react/solid';

const StatusIcon = ({ v }) => {
  if (v === 1) return <div className="text-emerald-600">✓</div>;
  if (v === 0.5) return <div className="text-amber-500">◐</div>;
  return <div className="text-rose-600">✗</div>;
};

const ParameterRow = ({ name, resumeValue, jobValue, score }) => {
  const formatted = (val) => {
    if (!val) return <span className="text-slate-400">—</span>;
    if (Array.isArray(val)) return (
      <div className="flex flex-wrap gap-2">
        {val.map((v, i) => <span key={i} className="px-2 py-1 bg-slate-50 text-slate-700 rounded-md text-xs border">{v}</span>)}
      </div>
    );
    if (typeof val === 'object') return (
      <div className="text-sm text-slate-700">{Object.entries(val).filter(([k])=>val[k]).map(([k,v])=>`${k}: ${v}`).join(', ')}</div>
    );
    return <div className="text-sm text-slate-700">{String(val)}</div>;
  };

  return (
    <div className="grid grid-cols-12 gap-4 items-start py-3 border-b last:border-b-0">
      <div className="col-span-3 text-sm font-medium capitalize">{name}</div>
      <div className="col-span-4">{formatted(resumeValue)}</div>
      <div className="col-span-3">{formatted(jobValue)}</div>
      <div className="col-span-1 text-center">{score}</div>
      <div className="col-span-1 flex justify-center"><StatusIcon v={score} /></div>
    </div>
  );
};

export default ParameterRow;
