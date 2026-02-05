const TITLE_MAP = {
  'software developer': 'software_engineer',
  'web developer': 'software_engineer',
  'backend developer': 'software_engineer',
  'frontend developer': 'software_engineer',
  'full stack developer': 'software_engineer',
  'fullstack developer': 'software_engineer',
  'software engineer': 'software_engineer',
  'developer': 'software_engineer',
  'engineer': 'software_engineer',
  'programmer': 'software_engineer',
  'react developer': 'frontend_developer',
  'frontend engineer': 'frontend_developer',
  'ui developer': 'frontend_developer',
  'backend engineer': 'backend_developer',
  'node developer': 'backend_developer',
  'api developer': 'backend_developer',
  'data scientist': 'data_professional',
  'data engineer': 'data_professional',
  'ml engineer': 'data_professional',
  'ai engineer': 'data_professional',
  'devops engineer': 'devops_professional',
  'cloud engineer': 'devops_professional',
  'sre': 'devops_professional',
  'qa engineer': 'qa_professional',
  'test engineer': 'qa_professional',
  'sdet': 'qa_professional'
};

const EDUCATION_MAP = {
  'b.tech': 'computer_science_degree',
  'btech': 'computer_science_degree',
  'be': 'computer_science_degree',
  'bachelor of engineering': 'computer_science_degree',
  'bachelor of technology': 'computer_science_degree',
  'bachelor': 'computer_science_degree',
  'bsc': 'computer_science_degree',
  'bsc cs': 'computer_science_degree',
  'bca': 'computer_science_degree',
  'computer science': 'computer_science_degree',
  'information technology': 'computer_science_degree',
  'm.tech': 'masters_degree',
  'mtech': 'masters_degree',
  'me': 'masters_degree',
  'master': 'masters_degree',
  'msc': 'masters_degree',
  'mca': 'masters_degree',
  'master of technology': 'masters_degree',
  'phd': 'doctorate',
  'doctorate': 'doctorate'
};

const SKILL_FAMILIES = {
  'react': 'frontend_js',
  'react.js': 'frontend_js',
  'reactjs': 'frontend_js',
  'next': 'frontend_js',
  'next.js': 'frontend_js',
  'nextjs': 'frontend_js',
  'vue': 'frontend_js',
  'vue.js': 'frontend_js',
  'angular': 'frontend_js',
  'svelte': 'frontend_js',
  'node': 'backend_js',
  'node.js': 'backend_js',
  'nodejs': 'backend_js',
  'nest': 'backend_js',
  'nestjs': 'backend_js',
  'express': 'backend_js',
  'expressjs': 'backend_js',
  'javascript': 'javascript',
  'js': 'javascript',
  'typescript': 'javascript',
  'ts': 'javascript',
  'python': 'python',
  'django': 'python',
  'flask': 'python',
  'fastapi': 'python',
  'java': 'java',
  'spring': 'java',
  'springboot': 'java',
  'mongo': 'database',
  'mongodb': 'database',
  'postgres': 'database',
  'postgresql': 'database',
  'mysql': 'database',
  'sql': 'database',
  'redis': 'database',
  'git': 'dev_tools',
  'github': 'dev_tools',
  'gitlab': 'dev_tools',
  'postman': 'dev_tools',
  'vscode': 'dev_tools',
  'npm': 'dev_tools',
  'yarn': 'dev_tools',
  'docker': 'devops',
  'kubernetes': 'devops',
  'k8s': 'devops',
  'aws': 'cloud',
  'azure': 'cloud',
  'gcp': 'cloud',
  'html': 'web_basics',
  'css': 'web_basics',
  'html5': 'web_basics',
  'css3': 'web_basics'
};

const INDUSTRY_KEYWORDS = {
  'technology': ['software', 'web', 'app', 'development', 'code', 'saas', 'tech', 'it', 'information technology'],
  'finance': ['banking', 'fintech', 'financial'],
  'healthcare': ['medical', 'health', 'hospital'],
  'ecommerce': ['retail', 'e-commerce', 'shopping']
};

const CITY_COUNTRY = {
  'mumbai': 'India',
  'delhi': 'India',
  'bangalore': 'India',
  'bengaluru': 'India',
  'pune': 'India',
  'hyderabad': 'India',
  'chennai': 'India',
  'kolkata': 'India',
  'ahmedabad': 'India',
  'jaipur': 'India',
  'indore': 'India',
  'noida': 'India',
  'gurgaon': 'India',
  'gurugram': 'India',
  'new york': 'USA',
  'los angeles': 'USA',
  'chicago': 'USA',
  'san francisco': 'USA',
  'seattle': 'USA',
  'austin': 'USA',
  'boston': 'USA',
  'london': 'UK',
  'manchester': 'UK',
  'toronto': 'Canada',
  'vancouver': 'Canada',
  'sydney': 'Australia',
  'melbourne': 'Australia',
  'singapore': 'Singapore'
};

function clean(str) {
  if (!str) return '';
  return str.toLowerCase().trim().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ');
}

function normalizeTitle(title) {
  if (!title) return '';
  const cleaned = clean(title);
  
  for (const [key, family] of Object.entries(TITLE_MAP)) {
    if (cleaned.includes(key) || key.includes(cleaned)) {
      return family;
    }
  }
  
  return cleaned;
}

function normalizeEducation(education) {
  if (!education) return '';
  const cleaned = clean(education);
  
  for (const [key, degree] of Object.entries(EDUCATION_MAP)) {
    if (cleaned.includes(key) || key.includes(cleaned)) {
      return degree;
    }
  }
  
  return cleaned;
}

function normalizeSkills(skillArray) {
  if (!Array.isArray(skillArray)) return [];
  
  const families = new Set();
  
  for (const skill of skillArray) {
    const cleaned = clean(skill);
    let found = false;
    
    for (const [key, family] of Object.entries(SKILL_FAMILIES)) {
      if (cleaned === key || cleaned.includes(key) || key.includes(cleaned)) {
        families.add(family);
        found = true;
        break;
      }
    }
    
    if (!found && cleaned) {
      families.add(cleaned);
    }
  }
  
  return Array.from(families);
}

function normalizeIndustry(text) {
  if (!text) return '';
  const cleaned = clean(text);
  
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some(kw => cleaned.includes(kw))) {
      return industry;
    }
  }
  
  return cleaned;
}

function inferCountry(city, country) {
  if (country) return country;
  if (!city) return '';
  
  const cleaned = clean(city);
  return CITY_COUNTRY[cleaned] || '';
}

module.exports = {
  normalizeTitle,
  normalizeEducation,
  normalizeSkills,
  normalizeIndustry,
  inferCountry
};
