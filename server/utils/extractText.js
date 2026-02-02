
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts plain text from a document buffer based on its mimetype.
 * @param {Buffer} buffer - The file buffer from multer.
 * @param {string} mimetype - The file mimetype.
 * @returns {Promise<string>} - Extracted text.
 */
async function extractText(buffer, mimetype) {
  try {
    if (mimetype === 'application/pdf') {
      const data = await pdf(buffer);
      return data.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ buffer: buffer });
      return result.value; // The raw text
    } else {
      throw new Error('Unsupported file type for extraction.');
    }
  } catch (error) {
    console.error('Extraction Error:', error);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
}

module.exports = {
  extractText
};
