
/**
 * Detects and extracts sections from the cleaned resume text.
 * 
 * @param {string} text - The cleaned resume text.
 * @returns {Object} - Structured sections (skills, experience, education).
 */
function parseResumeSections(text) {
  const sections = {
    fullText: text,
    skillsText: '',
    experienceText: '',
    educationText: ''
  };

  if (!text) return sections;

  const keywords = {
    skills: ["skills", "technical skills", "technologies"],
    experience: ["experience", "work experience", "employment", "work history"],
    education: ["education", "academic", "qualification"]
  };

  // Helper to find the first occurrence of any keyword in a list
  const findSectionStartIndex = (text, keywordList) => {
    let earliestIndex = -1;
    for (const keyword of keywordList) {
      const index = text.indexOf(keyword);
      if (index !== -1 && (earliestIndex === -1 || index < earliestIndex)) {
        earliestIndex = index;
      }
    }
    return earliestIndex;
  };

  const skillsIdx = findSectionStartIndex(text, keywords.skills);
  const expIdx = findSectionStartIndex(text, keywords.experience);
  const eduIdx = findSectionStartIndex(text, keywords.education);

  // Collect all found indices to determine boundaries
  const boundaries = [
    { type: 'skills', index: skillsIdx },
    { type: 'experience', index: expIdx },
    { type: 'education', index: eduIdx }
  ].filter(b => b.index !== -1).sort((a, b) => a.index - b.index);

  // Extract text for each detected section
  boundaries.forEach((boundary, i) => {
    const nextBoundary = boundaries[i + 1];
    // Slice from current heading to the next heading, or the next 1500 chars if end of text
    const end = nextBoundary ? nextBoundary.index : Math.min(boundary.index + 1500, text.length);
    const sectionContent = text.slice(boundary.index, end).trim();

    if (boundary.type === 'skills') sections.skillsText = sectionContent;
    if (boundary.type === 'experience') sections.experienceText = sectionContent;
    if (boundary.type === 'education') sections.educationText = sectionContent;
  });

  return sections;
}

module.exports = {
  parseResumeSections
};
