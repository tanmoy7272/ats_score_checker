function preCleanText(text) {
  if (!text) return '';

  const removeKeywords = [
    'salary', 'pay', 'benefits', 'perks', 'schedule', 'shift', 'office address',
    'contact number', 'phone', 'website', 'http', 'www', 'legal notice', 'terms',
    'privacy', 'policy', 'company history', 'about us', 'founded in', 'job types',
    'compensation', 'fax'
  ];

  const keepKeywords = [
    'skills', 'experience', 'responsibilities', 'requirements', 'tools',
    'technologies', 'education', 'certification', 'project', 'role',
    'developer', 'engineer', 'framework', 'language', 'city', 'country'
  ];

  const lines = String(text).toLowerCase().split(/\r?\n/);
  const cleaned = lines
    .map(line => line.trim())
    .filter(Boolean)
    .filter(line => {
      const hasKeep = keepKeywords.some(keyword => line.includes(keyword));
      if (hasKeep) return true;
      const hasRemove = removeKeywords.some(keyword => line.includes(keyword));
      return !hasRemove;
    });

  return cleaned.join('\n').trim();
}

module.exports = { preCleanText };
