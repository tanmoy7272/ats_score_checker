const { normalizeToken } = require('./synonymNormalizer');
const { normalizeTokens } = require('./normalizeTokens');

function calculateOverlap(arr1, arr2) {
  if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return { ratio: 0, matched: 0, required: 0 };
  
  const set1 = new Set(arr1.map(normalizeToken));
  const set2 = new Set(arr2.map(normalizeToken));
  
  const intersection = new Set([...set1].filter(item => set2.has(item)));
  const ratio = intersection.size / arr2.length;
  
  return { ratio, matched: intersection.size, required: arr2.length };
}

function matchArraysKeywords(required, candidate) {
  return matchArraysTokenized(required, candidate, 'keywords');
}

function matchArrays(required, candidate) {
  if (!required || !candidate || required.length === 0 || candidate.length === 0) {
    return { match: 0, reason: 'No data provided' };
  }
  
  const { ratio, matched, required: total } = calculateOverlap(required, candidate);
  
  if (ratio >= 0.6) return { match: 1, reason: `${matched} of ${total} matched` };
  if (ratio >= 0.3) return { match: 0.5, reason: `${matched} of ${total} matched` };
  
  return { match: 0, reason: `Only ${matched} of ${total} matched` };
}

function matchArraysTokenized(required, candidate, label) {
  if (!required || !candidate || required.length === 0 || candidate.length === 0) {
    return { match: 0, reason: 'No data provided' };
  }

  const requiredTokens = normalizeTokens(required);
  const candidateTokens = normalizeTokens(candidate);

  if (requiredTokens.length === 0 || candidateTokens.length === 0) {
    return { match: 0, reason: 'No data provided' };
  }

  const requiredSet = new Set(requiredTokens);
  const candidateSet = new Set(candidateTokens);

  const intersection = new Set([...requiredSet].filter(t => candidateSet.has(t)));
  const matched = intersection.size;
  const total = requiredSet.size;
  const ratio = total === 0 ? 0 : matched / total;

  if (ratio >= 0.6) return { match: 1, reason: `Strong match (${matched}/${total})` };
  if (ratio >= 0.3) return { match: 0.5, reason: `Partial match (${matched}/${total})` };

  return { match: 0, reason: `Low overlap (${matched}/${total})` };
}

module.exports = { calculateOverlap, matchArrays, matchArraysKeywords, matchArraysTokenized };
