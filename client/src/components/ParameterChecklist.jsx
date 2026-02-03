import React from 'react';
import ParameterItem from './ParameterItem';

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

const ParameterChecklist = ({ breakdown = {}, resume = {}, job = {} }) => {
  return (
    <div className="space-y-4">
      {ORDER.map(p => (
        <ParameterItem
          key={p.key}
          label={p.label}
          resumeValue={resume[p.key === 'experience' ? 'yearsExperience' : (p.key === 'industry' ? 'industries' : p.key)]}
          jobValue={job[p.key === 'experience' ? 'yearsExperience' : (p.key === 'industry' ? 'industries' : p.key)]}
          matchScore={breakdown?.[p.key] ?? 0}
        />
      ))}
    </div>
  );
};

export default ParameterChecklist;
