const SYNONYMS = {
  'nodejs': 'node',
  'node js': 'node',
  'node.js': 'node',
  'reactjs': 'react',
  'nextjs': 'next',
  'mongodb': 'mongo',
  'mongo db': 'mongo',
  'postgresql': 'postgres',
  'mysql db': 'mysql',
  'google cloud platform': 'gcp',
  'aws cloud': 'aws',
  'azure cloud': 'azure',
  'github': 'git',
  'gitlab': 'git',
  'restful': 'rest',
  'rest api': 'rest',
  'restful api': 'rest',
  'ci/cd': 'cicd',
  'ci cd': 'cicd',
  'continuous integration': 'cicd',
  'software developer': 'developer',
  'backend developer': 'developer',
  'frontend developer': 'developer',
  'full stack developer': 'developer',
  'btech': 'bachelor',
  'be': 'bachelor',
  'mca': 'masters',
  'computer applications': 'cs',
  'computer science': 'cs'
};

function normalizeTokens(arr) {
  if (!Array.isArray(arr)) return [];
  const tokens = new Set();

  arr.forEach((item) => {
    if (!item) return;
    const normalized = String(item)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!normalized) return;

    const phraseSynonym = SYNONYMS[normalized];
    if (phraseSynonym) {
      tokens.add(phraseSynonym);
    }

    normalized.split(' ').forEach((token) => {
      if (!token) return;
      tokens.add(SYNONYMS[token] || token);
    });
  });

  return [...tokens];
}

module.exports = { normalizeTokens, SYNONYMS };
