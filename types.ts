
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

export interface ScoreV2Response {
  score: number;
  breakdown: {
    skills: 0 | 0.5 | 1;
    tools: 0 | 0.5 | 1;
    title: 0 | 0.5 | 1;
    experience: 0 | 0.5 | 1;
    location: 0 | 0.5 | 1;
    industry: 0 | 0.5 | 1;
    education: 0 | 0.5 | 1;
    certification: 0 | 0.5 | 1;
    responsibility: 0 | 0.5 | 1;
    keywords: 0 | 0.5 | 1;
  };
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
