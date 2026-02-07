import React from 'react';
import ParameterItem from './ParameterItem';

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

const ParameterChecklist = ({ breakdown = {}, resume = {}, job = {} }) => {
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
    <div className="space-y-4">
      {Object.keys(breakdown).map(key => (
        <ParameterItem
          key={key}
          label={PARAMETER_LABELS[key] || key}
          resumeValue={formatValue(resume[key])}
          jobValue={formatValue(job[key])}
          matchScore={breakdown[key] ?? 0}
        />
      ))}
    </div>
  );
};

export default ParameterChecklist;
