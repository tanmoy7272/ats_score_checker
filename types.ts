
export interface ServerResponse {
  status: string;
}

export interface ResumeFeatures {
  skills: string[];
  experienceYears: number;
  degree: string | null;
}

export interface JobFeatures {
  summary: string;
  skills: string[];
  experienceYears: number;
  degree: string | null;
}

export interface ScoreResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasons: string[];
  improvements: string[];
}

export interface ResumeUploadResponse {
  success: boolean;
  filename: string;
  size: number;
  features: ResumeFeatures;
}

export interface JobAnalyzeResponse {
  success: boolean;
  job: JobFeatures;
}

export interface ScoreResponse {
  success: boolean;
  result: ScoreResult;
}
