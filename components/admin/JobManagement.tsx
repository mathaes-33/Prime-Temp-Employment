import React, { useState, useMemo } from 'react';
import { useJobs } from '../../context/JobContext';
import { Job, NewJob, NotificationType } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import JobForm from '../JobForm';
import { BriefcaseIcon, EditIcon, TrashIcon } from '../ui/icons';
import { sanitizeText } from '../../utils/sanitize';

const ITEMS_PER_PAGE = 5;

interface JobManagementProps {
  setNotification: (notification: NotificationType | null) => void;
}

const JobManagement: React.FC<JobManagementProps> = ({ setNotification }) => {
  const { jobs, addJob, updateJob, deleteJob } = useJobs();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return jobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [jobs, currentPage]);

  const handleOpenEditModal = (job: Job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  const handleJobCreate = async (jobDataFromForm: Job) => {
    try {
      const { id, postedDate, ...newJobData } = jobDataFromForm;
      await addJob(newJobData as NewJob);
      setNotification({ type: 'success', message: 'Job created successfully!' });
      setIsCreateModalOpen(false);
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to create job. Please try again.' });
    }
  };

  const handleJobUpdate = async (updatedJob: Job) => {
    try {
      await updateJob(updatedJob);
      setNotification({ type: 'success', message: 'Job updated successfully!' });
      setIsEditModalOpen(false);
      setSelectedJob(null);
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to update job. Please try again.' });
    }
  };

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (window.confirm(`Are you sure you want to delete the job posting: "${jobTitle}"? This action cannot be undone.`)) {
      try {
        await deleteJob(jobId);
        setNotification({ type: 'success', message: `Job "${jobTitle}" deleted.` });
      } catch (err) {
        setNotification({ type: 'error', message: 'Failed to delete job. Please try again.' });
      }
    }
  };

  return (
    <>
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Job">
        <JobForm onSubmit={handleJobCreate} onCancel={() => setIsCreateModalOpen(false)} />
      </Modal>

      {selectedJob && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Job: ${sanitizeText(selectedJob.title)}`}>
          <JobForm job={selectedJob} onSubmit={handleJobUpdate} onCancel={() => setIsEditModalOpen(false)} />
        </Modal>
      )}

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-dark flex items-center gap-2"><BriefcaseIcon className="h-6 w-6 text-primary" /> Job Management ({jobs.length})</h2>
          <Button onClick={() => setIsCreateModalOpen(true)}>Add New Job</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {paginatedJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark">{sanitizeText(job.title)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{sanitizeText(job.company)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{sanitizeText(job.employmentType)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => handleOpenEditModal(job)} className="text-primary hover:text-primary-dark p-1"><span className="sr-only">Edit</span><EditIcon className="h-5 w-5" /></button>
                    <button onClick={() => handleDeleteJob(job.id, job.title)} className="text-red-600 hover:text-red-800 p-1"><span className="sr-only">Delete</span><TrashIcon className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
         {totalPages > 1 && (
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-slate-500">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage <= 1} variant="secondary" className="!py-1 !px-3">
                Previous
              </Button>
              <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages} variant="secondary" className="!py-1 !px-3">
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </>
  );
};

export default JobManagement;