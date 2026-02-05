import React from 'react';

const Icon = ({ score }) => {
  if (score === 1) {
    return <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd" /></svg>;
  }
  if (score === 0.5) {
    return <svg className="w-5 h-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a1 1 0 011 1v6a1 1 0 11-2 0V4a1 1 0 011-1z" /></svg>;
  }
  return <svg className="w-5 h-5 text-rose-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
};

const renderValue = (v) => {
  if (v === undefined || v === null || v === '' || v === 'Not detected') {
    return <span className="text-slate-400 text-sm">Not detected</span>;
  }
  
  if (Array.isArray(v)) {
    if (v.length === 0) return <span className="text-slate-400 text-sm">Not detected</span>;
    return (
      <div className="flex flex-wrap gap-2 max-w-full">
        {v.map((x, i) => (
          <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs border border-slate-200 break-words whitespace-normal">{x}</span>
        ))}
      </div>
    );
  }
  
  return <div className="text-sm text-slate-700 break-words whitespace-normal max-w-full">{String(v)}</div>;
};

const ParameterRow = ({ label, resumeValue, jobValue, matchScore }) => {
  return (
    <div className="grid grid-cols-4 gap-4 px-4 py-3 items-start hover:bg-slate-50 transition-colors border-b last:border-b-0">
      <div className="font-medium text-slate-900 text-sm">{label}</div>
      <div className="text-sm text-slate-700">{renderValue(resumeValue)}</div>
      <div className="text-sm text-slate-700">{renderValue(jobValue)}</div>
      <div className="flex justify-center items-start pt-1">
        <Icon score={matchScore} />
      </div>
    </div>
  );
};

export default ParameterRow;
