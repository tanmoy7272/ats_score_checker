
const { extractText } = require('../utils/extractText');
const { cleanText } = require('../utils/cleanText');
const { parseResumeSections } = require('../utils/parseResume');
const { extractResumeFeatures } = require('../utils/extractFeatures');

const uploadResume = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Log the upload for debugging
    console.log(`Processing: ${file.originalname} (${file.size} bytes)`);

    // 1. Extract raw text from the buffer
    const rawText = await extractText(file.buffer, file.mimetype);

    // 2. Clean and normalize the extracted text
    const cleanedText = cleanText(rawText);

    // 3. Parse logical sections
    const parsed = parseResumeSections(cleanedText);

    // 4. Extract structured intelligence features
    const features = extractResumeFeatures(parsed);

    return res.status(200).json({
      success: true,
      filename: file.originalname,
      size: file.size,
      parsed: parsed,
      features: features
    });
  } catch (error) {
    console.error('Error in uploadResume controller:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to process resume.' 
    });
  }
};

module.exports = {
  uploadResume
};
