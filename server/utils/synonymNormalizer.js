/**
 * Normalize synonyms to canonical forms for better matching
 */

const TITLE_SYNONYMS = {
  'software developer': ['web developer', 'software engineer', 'developer', 'programmer', 'coder', 'backend developer', 'frontend developer', 'backend engineer', 'frontend engineer'],
  'full stack developer': ['fullstack developer', 'full-stack engineer', 'fullstack engineer', 'full stack engineer'],
  'react developer': ['react dev', 'reactjs developer', 'frontend developer', 'frontend engineer', 'ui developer'],
  'devops engineer': ['devops', 'site reliability engineer', 'sre', 'infrastructure engineer', 'platform engineer'],
  'data scientist': ['ml engineer', 'machine learning engineer', 'ai engineer', 'data engineer'],
  'qa engineer': ['qa', 'test engineer', 'sdet', 'quality engineer', 'tester', 'automation engineer'],
  'product manager': ['pm', 'product owner', 'po'],
  'software engineer': ['software developer', 'engineer', 'developer']
};

const EDUCATION_SYNONYMS = {
  'bachelor': ['btech', 'be', 'bs', 'bsc', 'ba', 'bachelor of engineering', 'bachelor of technology', 'bachelor of science', 'bca', 'bcom', 'bba'],
  'master': ['mtech', 'me', 'ms', 'msc', 'ma', 'mca', 'master of technology', 'master of science', 'master of computer applications', 'mba', 'mcom'],
  'phd': ['doctorate', 'doctoral', 'ph.d', 'doctor of philosophy'],
  'diploma': ['post graduate diploma', 'pgdm', 'advanced diploma']
};

const INDUSTRY_SYNONYMS = {
  'technology': ['it', 'software', 'tech', 'information technology', 'saas', 'software services'],
  'finance': ['fintech', 'banking', 'financial services', 'investment'],
  'healthcare': ['health', 'medical', 'pharma', 'pharmaceutical', 'biotech'],
  'ecommerce': ['e-commerce', 'retail', 'online retail', 'marketplace']
};

function normalizeTitle(title) {
  if (!title) return '';
  const lower = title.toLowerCase().trim();
  
  for (const [canonical, synonyms] of Object.entries(TITLE_SYNONYMS)) {
    if (lower === canonical || synonyms.some(syn => lower.includes(syn))) {
      return canonical;
    }
  }
  
  return lower;
}

function normalizeEducation(education) {
  if (!education) return '';
  const lower = education.toLowerCase().trim();
  
  for (const [canonical, synonyms] of Object.entries(EDUCATION_SYNONYMS)) {
    if (synonyms.some(syn => lower.includes(syn))) {
      return canonical;
    }
  }
  
  return lower;
}

function normalizeIndustry(industry) {
  if (!industry) return '';
  const lower = industry.toLowerCase().trim();
  
  for (const [canonical, synonyms] of Object.entries(INDUSTRY_SYNONYMS)) {
    if (lower === canonical || synonyms.some(syn => lower.includes(syn))) {
      return canonical;
    }
  }
  
  return lower;
}

function areSynonyms(text1, text2, type = 'title') {
  if (!text1 || !text2) return false;
  
  const normalizers = {
    title: normalizeTitle,
    education: normalizeEducation,
    industry: normalizeIndustry
  };
  
  const normalizer = normalizers[type] || ((t) => t.toLowerCase().trim());
  
  return normalizer(text1) === normalizer(text2);
}

module.exports = {
  normalizeTitle,
  normalizeEducation,
  normalizeIndustry,
  areSynonyms
};
