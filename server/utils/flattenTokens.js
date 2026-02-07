const { tokenizeText } = require('./tokenizeText');

function flattenTokens(arrayOfStrings) {
  if (!Array.isArray(arrayOfStrings)) return [];
  const tokens = arrayOfStrings.flatMap(tokenizeText);
  return [...new Set(tokens)];
}

module.exports = { flattenTokens };
