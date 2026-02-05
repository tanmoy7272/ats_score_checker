/**
 * Simple fuzzy text matcher using normalized string similarity
 */
function fuzzyTextMatch(text1, text2) {
  if (!text1 || !text2) return 0;
  
  const normalize = (str) => str.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
  
  const norm1 = normalize(text1);
  const norm2 = normalize(text2);
  
  if (norm1 === norm2) return 1;
  
  // Check if one contains the other
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 1;
  
  // Calculate similarity ratio
  const words1 = new Set(norm1.split(/\s+/).filter(w => w.length > 2));
  const words2 = new Set(norm2.split(/\s+/).filter(w => w.length > 2));
  
  if (words1.size === 0 || words2.size === 0) return 0;
  
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const smaller = Math.min(words1.size, words2.size);
  
  const similarity = intersection.size / smaller;
  
  if (similarity >= 0.4) return 1;
  if (similarity >= 0.2) return 0.5;
  
  return 0;
}

module.exports = { fuzzyTextMatch };
