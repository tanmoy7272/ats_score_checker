/**
 * Calculate overlap ratio between two arrays
 */
function calculateOverlap(arr1, arr2) {
  if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return 0;
  
  const normalize = (str) => str.toLowerCase().trim();
  
  const set1 = new Set(arr1.map(normalize));
  const set2 = new Set(arr2.map(normalize));
  
  const intersection = new Set([...set1].filter(item => set2.has(item)));
  const smaller = Math.min(set1.size, set2.size);
  
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
