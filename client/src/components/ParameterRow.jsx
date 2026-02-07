import React, { useMemo, useState } from 'react';

const Icon = ({ score }) => {
  if (score === 1) {
    return <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd" /></svg>;
  }
  if (score === 0.5) {
    return <svg className="w-5 h-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a1 1 0 011 1v6a1 1 0 11-2 0V4a1 1 0 011-1z" /></svg>;
  }
  return <svg className="w-5 h-5 text-rose-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
};

const normalizeLabel = (label) => String(label || '').toLowerCase();

const isSkillLike = (label) => {
  const l = normalizeLabel(label);
  return l.includes('skill') || l.includes('tools') || l.includes('keywords');
};

const isResponsibilitiesLike = (label) => {
  const l = normalizeLabel(label);
  return l.includes('responsibilit') || l.includes('achievement');
};

const isProjectLike = (label) => {
  const l = normalizeLabel(label);
  return l.includes('project') || l.includes('certification') || l.includes('portfolio');
};

const formatArraySummary = (arr) => {
  if (!arr || arr.length === 0) return 'N/A';
  if (arr.length <= 3) return arr.join(', ');
  const head = arr.slice(0, 3).join(', ');
  return `${head} +${arr.length - 3} more`;
};

const renderSummary = (value, label) => {
  if (value === undefined || value === null || value === '' || value === 'Not detected' || value === 'N/A') {
    return <span className="text-slate-400 text-sm">N/A</span>;
  }

  if (Array.isArray(value)) {
    if (isResponsibilitiesLike(label)) {
      return value.length > 0 ? (
        <span className="text-slate-600 text-sm">{value.length} items detected</span>
      ) : (
        <span className="text-slate-400 text-sm">N/A</span>
      );
    }

    if (isProjectLike(label)) {
      return value.length > 0 ? (
        <span className="text-slate-600 text-sm">{value.length} items</span>
      ) : (
        <span className="text-slate-400 text-sm">N/A</span>
      );
    }

    if (isSkillLike(label)) {
      return (
        <span className="text-slate-700 text-sm min-w-0 break-words whitespace-normal">
          {formatArraySummary(value)}
        </span>
      );
    }

    return (
      <span className="text-slate-700 text-sm min-w-0 break-words whitespace-normal">
        {formatArraySummary(value)}
      </span>
    );
  }

  if (typeof value === 'number') {
    return <span className="text-slate-700 text-sm">{value}</span>;
  }

  if (isProjectLike(label)) {
    return value ? (
      <span className="text-slate-600 text-sm">Provided</span>
    ) : (
      <span className="text-slate-400 text-sm">N/A</span>
    );
  }

  return (
    <span className="text-slate-700 text-sm min-w-0 break-words whitespace-normal">
      {String(value)}
    </span>
  );
};

const renderDetails = (value) => {
  if (value === undefined || value === null || value === '' || value === 'Not detected' || value === 'N/A') {
    return null;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return (
      <div className="flex flex-wrap items-start gap-2 w-full min-w-0 max-w-full">
        {value.map((item, idx) => (
          <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm border border-slate-200 max-w-full break-words whitespace-normal">{item}</span>
        ))}
      </div>
    );
  }

  return <div className="text-sm text-slate-700 break-words whitespace-normal">{String(value)}</div>;
};

const ParameterRow = ({ label, resumeValue, jobValue, matchScore, reason }) => {
  const [showDetails, setShowDetails] = useState(false);

  const hasDetails = useMemo(() => {
    if (Array.isArray(resumeValue)) return resumeValue.length > 0;
    if (Array.isArray(jobValue)) return jobValue.length > 0;
    return Boolean(resumeValue || jobValue);
  }, [resumeValue, jobValue]);

  return (
    <div className="border-b last:border-b-0">
      <div className="grid grid-cols-[180px_2fr_2fr_80px_220px] gap-4 px-4 py-3 items-start hover:bg-slate-50 transition-colors">
        <div className="font-medium text-slate-900 text-sm min-w-0 break-words whitespace-normal">{label}</div>
        <div className="text-sm text-slate-700 min-w-0 break-words whitespace-normal">
          <div className="w-full break-words whitespace-normal leading-relaxed">
            {renderSummary(resumeValue, label)}
          </div>
        </div>
        <div className="text-sm text-slate-700 min-w-0 break-words whitespace-normal">
          <div className="w-full break-words whitespace-normal leading-relaxed">
            {renderSummary(jobValue, label)}
          </div>
        </div>
        <div className="w-[80px] shrink-0 text-center flex justify-center items-center">
          <Icon score={matchScore} />
        </div>
        <div className="text-sm text-slate-600 min-w-0 break-words whitespace-normal">
          {reason || 'Not evaluated'}
        </div>
      </div>
      {hasDetails && (
        <div className="px-4 pb-3">
          <button
            type="button"
            className="text-xs text-slate-500 hover:text-slate-700"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide details' : 'View details'}
          </button>
          {showDetails && (
            <div className="mt-3 grid grid-cols-2 gap-4 min-w-0 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="min-w-0 break-words whitespace-normal">
                <div className="text-sm font-semibold text-gray-700 mb-2">Resume</div>
                {renderDetails(resumeValue)}
              </div>
              <div className="min-w-0 break-words whitespace-normal">
                <div className="text-sm font-semibold text-gray-700 mb-2">Job</div>
                {renderDetails(jobValue)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ParameterRow;
