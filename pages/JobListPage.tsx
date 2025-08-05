
import React, { useState, useEffect } from 'react';
import * as api from '../src/services/api';
import JobCard from '../components/JobCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import { Job } from '../types';
import { XCircleIcon } from '../components/ui/icons';
import { sanitizeText } from '../utils/sanitize';
import Button from '../components/ui/Button';

const JOBS_PER_PAGE = 6;

const JobListPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [types, setTypes] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  // Filter and pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);

  // Effect to fetch filter options on mount
  useEffect(() => {
    api.getUniqueValues('employmentType').then(setTypes).catch(console.error);
    api.getUniqueValues('location').then(setLocations).catch(console.error);
  }, []);

  // Effect to fetch jobs when filters or page change
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters: api.JobFilters = {
          searchTerm,
          employmentType: typeFilter,
          location: locationFilter,
          remoteOnly,
        };
        const response = await api.getJobs(filters, page, JOBS_PER_PAGE);
        setJobs(response.jobs);
        setTotalJobs(response.totalCount);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchJobs, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [searchTerm, typeFilter, locationFilter, remoteOnly, page]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, typeFilter, locationFilter, remoteOnly]);
  

  const renderContent = () => {
    if (loading) {
      return Array.from({ length: JOBS_PER_PAGE }).map((_, index) => <SkeletonCard key={index} />);
    }

    if (error) {
      return (
        <div className="text-center py-16 col-span-full bg-red-50 text-red-700 rounded-lg">
          <XCircleIcon className="h-12 w-12 mx-auto" />
          <h2 className="mt-4 text-2xl font-bold">An Error Occurred</h2>
          <p className="mt-2">{error}</p>
        </div>
      );
    }

    if (jobs.length > 0) {
      return jobs.map(job => <JobCard key={job.id} job={job} />);
    }

    return (
      <div className="text-center py-16 col-span-full">
        <h2 className="text-2xl font-bold text-dark">No Jobs Found</h2>
        <p className="mt-2 text-slate-500">Try adjusting your search filters.</p>
      </div>
    );
  };
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocationFilter(e.target.value);
    if(e.target.value !== 'all'){
        setRemoteOnly(false); // Can't have location and remote only
    }
  }
  
  const handleRemoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemoteOnly(e.target.checked);
    if(e.target.checked){
        setLocationFilter('all'); // Can't have location and remote only
    }
  }

  return (
    <div className="bg-light py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-dark">Find Your Next Opportunity</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">Browse our current openings and find your perfect fit.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-12 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <input
            type="text"
            placeholder="Search by title, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary md:col-span-2"
          />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="all">All Types</option>
            {types.map(type => <option key={type} value={type}>{sanitizeText(type)}</option>)}
          </select>
          <select value={locationFilter} onChange={handleLocationChange} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="all">All Locations</option>
            {locations.map(loc => <option key={loc} value={loc}>{sanitizeText(loc)}</option>)}
          </select>
          <div className="flex items-center justify-start md:col-span-4 mt-2">
            <input 
              type="checkbox"
              id="remote-only"
              checked={remoteOnly}
              onChange={handleRemoteChange}
              className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
            />
            <label htmlFor="remote-only" className="ml-2 block text-sm text-slate-900">
              Show remote jobs only
            </label>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {renderContent()}
        </div>

        {!loading && totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <Button onClick={() => setPage(p => p - 1)} disabled={page <= 1} variant="secondary">
              Previous
            </Button>
            <span className="text-slate-600 font-medium">
              Page {page} of {totalPages}
            </span>
            <Button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages} variant="secondary">
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListPage;
