import React from 'react';
import ParameterRow from './ParameterRow';

const PARAMETER_LABELS = {
  coreSkills: 'Core Skills',
  secondarySkills: 'Secondary Skills',
  tools: 'Tools',
  relevantExperience: 'Relevant Experience',
  totalExperience: 'Total Experience',
  responsibilities: 'Responsibilities',
  title: 'Job Title',
  industry: 'Industry',
  projectRelevance: 'Project Relevance',
  skillCoverage: 'Skill Coverage',
  skillRecency: 'Skill Recency',
  toolProficiency: 'Tool Proficiency',
  employmentStability: 'Employment Stability',
  careerProgression: 'Career Progression',
  responsibilityComplexity: 'Responsibility Complexity',
  leadership: 'Leadership',
  educationLevel: 'Education Level',
  educationField: 'Education Field',
  certifications: 'Certifications',
  portfolio: 'Portfolio',
  city: 'City',
  country: 'Country',
  remotePreference: 'Remote Preference',
  noticePeriod: 'Notice Period',
  employmentType: 'Employment Type',
  keywords: 'Keywords',
  softSkills: 'Soft Skills',
  achievements: 'Achievements',
  resumeStructure: 'Resume Structure',
  languageQuality: 'Language Quality'
};

const FeatureTable = ({ resume, job, breakdown }) => {
  const summarize = (arr) => {
    if (!arr || arr.length === 0) return 'N/A';
    if (arr.length <= 3) return arr.join(', ');
    return `${arr.slice(0, 3).join(', ')} +${arr.length - 3} more`;
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '' || value === 'Not detected' || value === 'N/A') return 'N/A';
    if (Array.isArray(value)) return summarize(value);
    if (typeof value === 'number') return value.toString();
    return value || 'N/A';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="mb-4 text-sm font-bold">Parameter Matching Breakdown</div>
      <div className="grid grid-cols-12 gap-4 text-xs text-slate-500 font-semibold border-b pb-2 mb-3">
        <div className="col-span-3">Parameter</div>
        <div className="col-span-4">Resume</div>
        <div className="col-span-3">Job</div>
        <div className="col-span-1 text-center">Score</div>
        <div className="col-span-1"></div>
      </div>

      <div>
        {Object.keys(breakdown || {}).map(key => (
          <ParameterRow
            key={key}
            name={PARAMETER_LABELS[key] || key}
            resumeValue={formatValue(resume?.[key])}
            jobValue={formatValue(job?.[key])}
            score={breakdown[key] ?? 0}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureTable;
