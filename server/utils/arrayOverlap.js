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
  'mongo': 'database',
  'mongodb': 'database',
  'postgres': 'database',
  'postgresql': 'database',
  'mysql': 'database',
  'sql': 'database',
  'redis': 'database',
  'javascript': 'javascript',
  'js': 'javascript',
  'typescript': 'javascript',
  'ts': 'javascript'
};

function getSkillFamily(skill) {
  const lower = skill.toLowerCase().trim();
  for (const [key, family] of Object.entries(SKILL_FAMILIES)) {
    if (lower === key || lower.includes(key) || key.includes(lower)) {
      return family;
    }
  }
  return lower;
}

function calculateOverlap(arr1, arr2) {
  if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return 0;
  
  const families1 = new Set(arr1.map(getSkillFamily));
  const families2 = new Set(arr2.map(getSkillFamily));
  
  const intersection = new Set([...families1].filter(item => families2.has(item)));
  const smaller = Math.min(families1.size, families2.size);
  
  return intersection.size / smaller;
}

/**
 * Match arrays using keyword overlap (for responsibilities)
 */
function matchArraysKeywords(required, candidate) {
  if (!required || !candidate || required.length === 0 || candidate.length === 0) return 0;
  
  const tokenize = (arr) => {
    const tokens = new Set();
    arr.forEach(str => {
      const words = str.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3);
      words.forEach(w => tokens.add(w));
    });
    return tokens;
  };
  
  const tokens1 = tokenize(required);
  const tokens2 = tokenize(candidate);
  
  if (tokens1.size === 0 || tokens2.size === 0) return 0;
  
  const intersection = new Set([...tokens1].filter(t => tokens2.has(t)));
  const smaller = Math.min(tokens1.size, tokens2.size);
  const overlap = intersection.size / smaller;
  
  if (overlap >= 0.6) return 1;
  if (overlap >= 0.3) return 0.5;
  
  return 0;
}

function matchArrays(required, candidate) {
  const overlap = calculateOverlap(required, candidate);
  
  if (overlap >= 0.6) return 1;
  if (overlap >= 0.3) return 0.5;
  
  return 0;
}

module.exports = { calculateOverlap, matchArrays, matchArraysKeywords };
