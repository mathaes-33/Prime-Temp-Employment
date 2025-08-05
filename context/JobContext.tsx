
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Job, NewJob } from '../types';
import * as api from '../src/services/api';

interface JobContextType {
  jobs: Job[];
  addJob: (jobData: NewJob) => Promise<Job>;
  deleteJob: (jobId: string) => Promise<void>;
  updateJob: (updatedJob: Job) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        // The getJobs API returns a paginated response object. We need to access the `jobs` array from it.
        // This also fixes a logic bug where only the first page of jobs was loaded for the admin context.
        // We now fetch a large number of jobs to ensure the admin panel has access to all of them.
        const response = await api.getJobs({}, 1, 1000);
        setJobs(response.jobs);
      } catch (err) {
        console.error("Failed to load jobs from API", err);
        setError("Failed to load job listings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const addJob = async (jobData: NewJob) => {
    try {
      const newJob = await api.createJob(jobData);
      setJobs(currentJobs => [newJob, ...currentJobs]);
      return newJob;
    } catch (err) {
      console.error("Failed to create job:", err);
      throw err; // Re-throw to be caught by the component
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      await api.deleteJob(jobId);
      setJobs(currentJobs => currentJobs.filter(job => job.id !== jobId));
    } catch (err) {
      console.error("Failed to delete job:", err);
      throw err;
    }
  };

  const updateJob = async (updatedJob: Job) => {
    try {
      await api.updateJob(updatedJob);
      setJobs(currentJobs => currentJobs.map(job => (job.id === updatedJob.id ? updatedJob : job)));
    } catch (err) {
      console.error("Failed to update job:", err);
      throw err;
    }
  };

  return (
    <JobContext.Provider value={{ jobs, addJob, deleteJob, updateJob, loading, error }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = (): JobContextType => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
