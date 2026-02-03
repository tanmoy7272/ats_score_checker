import React from 'react';
import ParameterRow from './ParameterRow';

const FeatureTable = ({ resume, job, breakdown }) => {
  const params = [
    { key: 'skills', label: 'Skills' },
    { key: 'tools', label: 'Tools' },
    { key: 'title', label: 'Title' },
    { key: 'yearsExperience', label: 'Years Experience' },
    { key: 'location', label: 'Location' },
    { key: 'industries', label: 'Industries' },
    { key: 'education', label: 'Education' },
    { key: 'certifications', label: 'Certifications' },
    { key: 'responsibilities', label: 'Responsibilities' },
    { key: 'keywords', label: 'Keywords' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="mb-4 text-sm font-bold">Matching Breakdown</div>
      <div className="grid grid-cols-12 gap-4 text-xs text-slate-500 font-semibold border-b pb-2 mb-3">
        <div className="col-span-3">Parameter</div>
        <div className="col-span-4">Resume</div>
        <div className="col-span-3">Job</div>
        <div className="col-span-1 text-center">Score</div>
        <div className="col-span-1"></div>
      </div>

      <div>
        {params.map(p => (
          <ParameterRow
            key={p.key}
            name={p.label}
            resumeValue={resume?.[p.key]}
            jobValue={job?.[p.key]}
            score={breakdown?.[p.key] ?? 0}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureTable;
