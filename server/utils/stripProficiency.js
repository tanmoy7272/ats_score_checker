function stripProficiency(text) {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .trim();
}

module.exports = { stripProficiency };
