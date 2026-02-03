import React from 'react';
import ParameterRow from './ParameterRow';

const ORDER = [
  { key: 'skills', label: 'Skills' },
  { key: 'tools', label: 'Tools' },
  { key: 'title', label: 'Job Title' },
  { key: 'experience', label: 'Experience' },
  { key: 'location', label: 'Location' },
  { key: 'industry', label: 'Industry' },
  { key: 'education', label: 'Education' },
  { key: 'certification', label: 'Certifications' },
  { key: 'responsibility', label: 'Responsibilities' },
  { key: 'keywords', label: 'Keywords' }
];

const ParameterTable = ({ breakdown = {}, resume = {}, job = {} }) => {
  const getResumeKey = (key) => {
    // Map breakdown keys to feature object keys
    const mapping = {
      'experience': 'yearsExperience',
      'industry': 'industries',
      'responsibility': 'responsibilities'
    };
    return mapping[key] || key;
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <div className="grid grid-cols-4 gap-0 border-b border-slate-200 bg-slate-50 p-4 font-semibold text-sm text-slate-700">
        <div>Parameter</div>
        <div>Resume</div>
        <div>Job</div>
        <div className="text-center">Match</div>
      </div>
      <div>
        {ORDER.map((p) => (
          <ParameterRow
            key={p.key}
            label={p.label}
            resumeValue={resume?.[getResumeKey(p.key)]}
            jobValue={job?.[getResumeKey(p.key)]}
            matchScore={breakdown?.[p.key] ?? 0}
          />
        ))}
      </div>
    </div>
  );
};

export default ParameterTable;
