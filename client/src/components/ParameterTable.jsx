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
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <div className="grid grid-cols-[180px_2fr_2fr_80px_220px] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-sm text-slate-700 items-start">
        <div className="min-w-0 break-words whitespace-normal">Parameter</div>
        <div className="min-w-0 break-words whitespace-normal">Resume</div>
        <div className="min-w-0 break-words whitespace-normal">Job</div>
        <div className="w-[80px] shrink-0 text-center flex justify-center items-center">Match</div>
        <div className="min-w-0 break-words whitespace-normal">Reason</div>
      </div>
      <div>
        {Object.keys(breakdown).map((key) => (
          <ParameterRow
            key={key}
            label={PARAMETER_LABELS[key] || key}
            resumeValue={breakdown[key]?.resumeValue}
            jobValue={breakdown[key]?.jobValue}
            matchScore={breakdown[key]?.match ?? 0}
            reason={breakdown[key]?.reason || 'Not evaluated'}
          />
        ))}
      </div>
    </div>
  );
};

export default ParameterTable;
