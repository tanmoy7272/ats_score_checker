function stemToken(word) {
  if (!word) return '';
  let w = String(word).toLowerCase();

  const rules = [
    { suffix: 'ing', replace: '' },
    { suffix: 'ed', replace: '' },
    { suffix: 'ers', replace: '' },
    { suffix: 'er', replace: '' },
    { suffix: 'tion', replace: '' },
    { suffix: 'sion', replace: '' },
    { suffix: 'ments', replace: '' },
    { suffix: 'ment', replace: '' },
    { suffix: 'ies', replace: 'y' },
    { suffix: 's', replace: '' }
  ];

  for (const rule of rules) {
    if (w.endsWith(rule.suffix)) {
      const base = w.slice(0, -rule.suffix.length) + rule.replace;
      if (base.length > 3) {
        w = base;
      }
      break;
    }
  }

  return w;
}

module.exports = { stemToken };
