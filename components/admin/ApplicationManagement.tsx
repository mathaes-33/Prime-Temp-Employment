
import React, { useState, useMemo } from 'react';
import { useApplications } from '../../hooks/useApplications';
import { EmployeeFormData } from '../../types';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { InboxIcon, UserIcon, TrashIcon, LoaderIcon } from '../ui/icons';
import { sanitizeText } from '../../utils/sanitize';

const ITEMS_PER_PAGE = 5;

const ApplicationManagement: React.FC = () => {
  const { applications, loading, error, deleteApplication } = useApplications();
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<EmployeeFormData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE);
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return applications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [applications, currentPage]);

  const handleOpenAppModal = (app: EmployeeFormData) => {
    setSelectedApp(app);
    setIsAppModalOpen(true);
  };
  
  const handleDelete = (id?: string) => {
    if (id) {
        deleteApplication(id);
    }
  }

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center py-4"><LoaderIcon className="h-6 w-6 mr-2" /> Loading applications...</div>;
    }
    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>
    }
    if (applications.length === 0) {
        return <p className="text-slate-500 text-center py-4">No new applications.</p>
    }
    return (
      <>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applicant</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applying For</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {paginatedApplications.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark">{sanitizeText(app.fullName)} <br /><span className="text-slate-500">{sanitizeText(app.email)}</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{sanitizeText(app.jobTitle)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => handleOpenAppModal(app)} className="text-primary hover:text-primary-dark p-1"><span className="sr-only">View</span><UserIcon className="h-5 w-5" /></button>
                  <button onClick={() => handleDelete(app.id)} className="text-red-600 hover:text-red-800 p-1"><span className="sr-only">Delete</span><TrashIcon className="h-5 w-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      </>
    )
  }

  return (
    <>
      {selectedApp && (
        <Modal isOpen={isAppModalOpen} onClose={() => setIsAppModalOpen(false)} title={`Application: ${sanitizeText(selectedApp.fullName)}`}>
          <div className="space-y-4">
            <div><strong>Job Title:</strong> {sanitizeText(selectedApp.jobTitle)}</div>
            <div><strong>Email:</strong> <a href={`mailto:${selectedApp.email}`} className="text-primary hover:underline">{sanitizeText(selectedApp.email)}</a></div>
            <div><strong>Phone:</strong> {sanitizeText(selectedApp.phone) || 'N/A'}</div>
            <div><strong>Address:</strong> {sanitizeText(selectedApp.address) || 'N/A'}</div>
            <div><strong>Availability:</strong> {sanitizeText(selectedApp.availability.join(', '))}</div>
            <div><strong>Skills:</strong><p className="p-2 bg-slate-100 rounded-md whitespace-pre-wrap">{sanitizeText(selectedApp.skills) || 'N/A'}</p></div>
            <div><strong>Work History:</strong><p className="p-2 bg-slate-100 rounded-md whitespace-pre-wrap">{sanitizeText(selectedApp.workHistory) || 'N/A'}</p></div>
            <div><strong>Desired Industries:</strong><p className="p-2 bg-slate-100 rounded-md whitespace-pre-wrap">{sanitizeText(selectedApp.desiredIndustries) || 'N/A'}</p></div>
            <div><strong>Cover Letter:</strong><p className="p-2 bg-slate-100 rounded-md whitespace-pre-wrap">{sanitizeText(selectedApp.coverLetter) || 'N/A'}</p></div>
            <div>
              <strong>Resume:</strong>{' '}
              {selectedApp.resume ? (
                <a
                  href={selectedApp.resume}
                  download={sanitizeText(selectedApp.resumeFilename)}
                  className="text-primary hover:underline"
                >
                  {sanitizeText(selectedApp.resumeFilename)}
                </a>
              ) : 'N/A'}
            </div>
            <div className="text-right text-xs text-slate-500">Submitted: {selectedApp.submittedAt ? new Date(selectedApp.submittedAt).toLocaleString() : 'N/A'}</div>
          </div>
        </Modal>
      )}

      <Card>
        <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2"><InboxIcon className="h-6 w-6 text-primary" /> Candidate Applications ({!loading && applications.length})</h2>
        <div className="overflow-x-auto">
          {renderContent()}
        </div>
      </Card>
    </>
  );
};

export default ApplicationManagement;