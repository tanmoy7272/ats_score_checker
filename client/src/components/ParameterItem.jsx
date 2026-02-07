import React from 'react';

const Icon = ({ score }) => {
  if (score === 1) {
    return (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
      </svg>
    );
  }
  if (score === 0.5) {
    return (
      <svg className="w-5 h-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3a1 1 0 011 1v6a1 1 0 11-2 0V4a1 1 0 011-1z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5 text-rose-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
};

const summarize = (arr) => {
  if (!arr || arr.length === 0) return 'N/A';
  if (arr.length <= 3) return arr.join(', ');
  return `${arr.slice(0, 3).join(', ')} +${arr.length - 3} more`;
};

const renderValue = (v) => {
  if (v === undefined || v === null || v === '' || v === 'Not detected' || v === 'N/A') {
    return <span className="text-slate-400">N/A</span>;
  }
  if (Array.isArray(v)) {
    return <span className="text-slate-700 text-xs">{summarize(v)}</span>;
  }
  return <div className="text-sm text-slate-700 break-words whitespace-normal">{String(v)}</div>;
};

const ParameterItem = ({ label, resumeValue, jobValue, matchScore }) => {
  const bg = matchScore === 1 ? 'bg-emerald-50' : matchScore === 0.5 ? 'bg-amber-50' : 'bg-rose-50';
  return (
    <div className="flex items-center justify-between p-3 rounded-lg shadow-sm border border-slate-100 bg-white">
      <div className="flex items-start gap-3">
        <div className={`rounded-full p-2 ${bg} flex items-center justify-center`}>
          <Icon score={matchScore} />
        </div>
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="mt-1 text-xs text-slate-500">Resume: {renderValue(resumeValue)}</div>
          <div className="mt-1 text-xs text-slate-500">Job: {renderValue(jobValue)}</div>
        </div>
      </div>
      <div className="text-sm font-semibold text-slate-700">{matchScore === 1 ? 'Matched' : matchScore === 0.5 ? 'Partial' : 'No'}</div>
    </div>
  );
};

export default ParameterItem;
