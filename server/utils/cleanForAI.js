function cleanForAI(text) {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .split('\n')
    .filter(line => {
      const bad = [
        'salary', 'pay', 'benefits', 'perks', 'schedule',
        'shift', 'office address', 'contact number',
        'phone', 'website', 'http', 'www', 'policy',
        'terms', 'privacy', 'about us', 'founded',
        'company profile', 'job types', 'compensation'
      ];

      return !bad.some(b => line.includes(b));
    })
    .join(' ')
    .slice(0, 8000);
}

module.exports = { cleanForAI };
