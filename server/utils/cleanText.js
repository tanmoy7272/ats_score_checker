
/**
 * Cleans and normalizes extracted text.
 * 1. Convert to lowercase
 * 2. Remove bullet symbols
 * 3. Remove special characters (except alphanumeric, periods, and commas)
 * 4. Collapse extra spaces and multiple newlines
 * 5. Trim result
 * 
 * @param {string} text - Raw text from document.
 * @returns {string} - Cleaned text.
 */
function cleanText(text) {
  if (!text) return '';

  let cleaned = text.toLowerCase();

  // Remove common bullet symbols
  cleaned = cleaned.replace(/[•●▪◆■*·-]/g, ' ');

  // Remove special characters except letters, numbers, periods, and commas
  // Keeping whitespace (\s) to process it in the next step
  cleaned = cleaned.replace(/[^a-z0-9.,\s]/g, ' ');

  // Collapse multiple newlines and spaces into single spaces 
  // (Matches user example: "React ● Node.js\n\n\nEXPERIENCE" -> "react node.js experience")
  cleaned = cleaned.replace(/\s+/g, ' ');

  return cleaned.trim();
}

module.exports = {
  cleanText
};
