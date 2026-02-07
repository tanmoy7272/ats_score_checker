const { stemToken } = require('./stemToken');

function tokenizeText(input) {
  if (!input) return [];
  return String(input)
    .toLowerCase()
    .replace(/[.,()&/\-_+:]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(stemToken);
}

module.exports = { tokenizeText };
