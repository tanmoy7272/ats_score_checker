
import axios from 'https://esm.sh/axios';
import { 
  ResumeUploadResponse, 
  JobAnalyzeResponse, 
  ScoreResponse, 
  ResumeFeatures, 
  JobFeatures 
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Uploads a resume file to the server for processing.
 */
export const uploadResume = async (file: File): Promise<ResumeUploadResponse> => {
  const formData = new FormData();
  formData.append('resume', file);
  
  const response = await axios.post(`${API_BASE_URL}/resume/upload`, formData, {
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
  const response = await axios.post(`${API_BASE_URL}/job/analyze`, { description });
  return response.data;
};

/**
 * Compares resume and job features to get an AI-powered score and insights.
 */
export const scoreCandidate = async (
  resume: ResumeFeatures, 
  job: JobFeatures
): Promise<ScoreResponse> => {
  const response = await axios.post(`${API_BASE_URL}/score`, { resume, job });
  return response.data;
};
