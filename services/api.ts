
import axios from 'https://esm.sh/axios';
import { 
  ResumeUploadResponse, 
  JobAnalyzeResponse, 
  ScoreResponse, 
  ResumeFeatures, 
  JobFeatures 
} from '../types';

// In development, use empty string to leverage Vite proxy
// In production, prefer VITE_API_URL if set; otherwise use same-origin rewrites
const API_BASE_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_URL || '');

/**
 * Uploads a resume file to the server for processing.
 */
export const uploadResume = async (file: File): Promise<ResumeUploadResponse> => {
  const formData = new FormData();
  formData.append('resume', file);
  
  const response = await axios.post(`${API_BASE_URL}/api/resume/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Sends a job description string for feature extraction.
 */
export const analyzeJob = async (description: string): Promise<JobAnalyzeResponse> => {
  const response = await axios.post(`${API_BASE_URL}/api/job/analyze`, { description });
  return response.data;
};

/**
 * Compares resume and job features to get an AI-powered score and insights.
 */
export const scoreCandidate = async (
  resume: ResumeFeatures, 
  job: JobFeatures
): Promise<ScoreResponse> => {
  const response = await axios.post(`${API_BASE_URL}/api/score`, { resume, job });
  return response.data;
};

export const scoreCandidateV2 = async (
  resumeText: string,
  jobText: string
): Promise<any> => {
  const response = await axios.post(`${API_BASE_URL}/api/score/v2`, { resumeText, jobText });
  return response.data;
};
