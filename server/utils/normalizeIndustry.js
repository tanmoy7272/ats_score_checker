function normalizeIndustry(text) {
  if (!text) return '';
  const lower = String(text).toLowerCase();
  const signals = [
    'software',
    'it',
    'technology',
    'tech',
    'saas',
    'web',
    'application',
    'digital',
    'solutions',
    'services',
    'engineering'
  ];

  if (signals.some(term => lower.includes(term))) {
    return 'technology';
  }

  return lower;
}

module.exports = { normalizeIndustry };
