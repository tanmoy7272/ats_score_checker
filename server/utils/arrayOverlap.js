const { normalizeToken } = require('./synonymNormalizer');

function calculateOverlap(arr1, arr2) {
  if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return { ratio: 0, matched: 0, required: 0 };
  
  const set1 = new Set(arr1.map(normalizeToken));
  const set2 = new Set(arr2.map(normalizeToken));
  
  const intersection = new Set([...set1].filter(item => set2.has(item)));
  const ratio = intersection.size / arr2.length;
  
  return { ratio, matched: intersection.size, required: arr2.length };
}

function matchArraysKeywords(required, candidate) {
  if (!required || !candidate || required.length === 0 || candidate.length === 0) {
    return { match: 0, reason: 'No data provided' };
  }
  
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
  
  if (tokens1.size === 0 || tokens2.size === 0) {
    return { match: 0, reason: 'No data provided' };
  }
  
  const intersection = new Set([...tokens1].filter(t => tokens2.has(t)));
  const matched = intersection.size;
  const total = tokens1.size;
  const ratio = matched / total;
  
  if (ratio >= 0.6) return { match: 1, reason: `Strong match (${matched}/${total} keywords)` };
  if (ratio >= 0.3) return { match: 0.5, reason: `Partial match (${matched}/${total} keywords)` };
  
  return { match: 0, reason: `Low overlap (${matched}/${total} keywords)` };
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

module.exports = { calculateOverlap, matchArrays, matchArraysKeywords };
