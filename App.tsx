
import React, { useState } from 'react';
import { uploadResume, scoreCandidateV2 } from './services/api';
import DashboardHeader from './client/src/components/DashboardHeader';
import ParameterTable from './client/src/components/ParameterTable';
import { ScoreV2Response } from './types';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScoreV2Response | null>(null);

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      setError('Both a resume file and a job description are required.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const resumeResponse = await uploadResume(file);
      const resumeText = resumeResponse.parsed?.fullText || '';

      const scoreResponse = await scoreCandidateV2(resumeText, jobDescription);
      setResult(scoreResponse);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Processing failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <nav className="bg-white border-b border-slate-200 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span className="text-xl font-bold tracking-tight">ATS <span className="text-indigo-600">Scorer</span></span>
          </div>
          <div className="text-xs text-slate-400 font-medium">v2.0 Professional</div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 pb-20">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Resume ATS Score Analyzer</h1>
          <p className="mt-2 text-slate-500 max-w-2xl mx-auto">Upload your resume and job description to see detailed matching analysis across 30 parameters.</p>
        </header>

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Resume (PDF/DOCX)</label>
            <div className="relative group">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".pdf,.docx"
              />
              <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${file ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-300 group-hover:border-indigo-400 bg-slate-50 group-hover:bg-indigo-50/10'}`}>
                <div className={`p-3 rounded-full mb-3 ${file ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <span className="text-sm font-medium text-slate-700">{file ? file.name : 'Choose file or drag & drop'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Job Description</label>
            <textarea
              rows={6}
              className="w-full rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all p-3"
              placeholder="Paste the target Job Description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !file || !jobDescription.trim()}
              className={`w-full mt-4 py-3 rounded-xl font-bold text-white shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2 ${loading || !file || !jobDescription.trim() ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0'}`}
            >
              {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Analyzing...</> : 'Analyze Compatibility'}
            </button>
            {error && <p className="text-rose-600 text-sm font-medium mt-3 text-center bg-rose-50 py-2 rounded-lg">{error}</p>}
          </div>
        </div>

        {/* Results Section */}
        {!result && !loading && (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-16 text-center text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-600">No Analysis Yet</h3>
            <p className="text-sm mt-1">Complete the inputs above and click Analyze to see your detailed matching report.</p>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-200 animate-pulse text-center space-y-4">
            <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto"></div>
            <div className="h-6 bg-slate-100 w-3/4 mx-auto rounded"></div>
            <div className="h-4 bg-slate-100 w-1/2 mx-auto rounded"></div>
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            {/* 3-Column Dashboard Header */}
            <DashboardHeader score={result.score} breakdown={result.breakdown} />

            {/* Parameter Comparison Table */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Parameter Matching Details</h2>
              <ParameterTable 
                breakdown={result.breakdown} 
                resume={result.resumeFeatures} 
                job={result.jobFeatures} 
              />
            </div>

            {/* AI Insights */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">AI Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full text-xs">i</span>
                    Why This Score?
                  </h3>
                  <ul className="space-y-2">
                    {(result.reasons || []).map((r, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-indigo-600 mt-0.5 flex-shrink-0">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full text-xs">✓</span>
                    How to Improve
                  </h3>
                  <ul className="space-y-2">
                    {(result.improvements || []).map((imp, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-emerald-600 mt-0.5 flex-shrink-0">→</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
