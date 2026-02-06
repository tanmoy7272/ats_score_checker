const SYNONYMS = {
  'react': 'react',
  'reactjs': 'react',
  'react.js': 'react',
  'next': 'react',
  'nextjs': 'react',
  'next.js': 'react',
  'node': 'node',
  'nodejs': 'node',
  'node.js': 'node',
  'nest': 'node',
  'nestjs': 'node',
  'express': 'node',
  'expressjs': 'node',
  'mongo': 'mongodb',
  'mongodb': 'mongodb',
  'postgres': 'postgresql',
  'postgresql': 'postgresql',
  'mysql': 'mysql',
  'sql': 'sql',
  'btech': 'bachelor',
  'be': 'bachelor',
  'bs': 'bachelor',
  'bsc': 'bachelor',
  'bachelor': 'bachelor',
  'mca': 'master',
  'mtech': 'master',
  'ms': 'master',
  'master': 'master',
  'web developer': 'software developer',
  'software engineer': 'software developer',
  'developer': 'software developer',
  'engineer': 'software developer',
  'technology': 'technology',
  'it': 'technology',
  'software': 'technology',
  'tech': 'technology'
};

function normalizeToken(token) {
  if (!token) return '';
  const lower = token.toLowerCase().trim();
  return SYNONYMS[lower] || lower;
}

function normalizeTokens(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map(normalizeToken);
}

function areSimilar(text1, text2) {
  if (!text1 || !text2) return false;
  const t1 = normalizeToken(text1);
  const t2 = normalizeToken(text2);
  return t1 === t2 || text1.toLowerCase().includes(text2.toLowerCase()) || text2.toLowerCase().includes(text1.toLowerCase());
}

module.exports = { normalizeToken, normalizeTokens, areSimilar };
