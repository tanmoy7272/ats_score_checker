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

const ParameterTable = ({ breakdown = {}, resume = {}, job = {} }) => {
  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') return 'Not detected';
    if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : 'Not detected';
    if (typeof value === 'number') return value.toString();
    return value || 'Not detected';
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <div className="grid grid-cols-4 gap-0 border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-sm text-slate-700">
        <div>Parameter</div>
        <div>Resume</div>
        <div>Job</div>
        <div className="text-center">Match</div>
      </div>
      <div>
        {Object.keys(breakdown).map((key) => (
          <ParameterRow
            key={key}
            label={PARAMETER_LABELS[key] || key}
            resumeValue={formatValue(resume?.[key])}
            jobValue={formatValue(job?.[key])}
            matchScore={breakdown[key] ?? 0}
          />
        ))}
      </div>
    </div>
  );
};

export default ParameterTable;
