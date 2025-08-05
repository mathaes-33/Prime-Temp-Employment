
import React, { useState, useMemo } from 'react';
import { useInquiries } from '../../hooks/useInquiries';
import { EmployerFormData } from '../../types';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { InboxIcon, BriefcaseIcon, TrashIcon, LoaderIcon } from '../ui/icons';
import { sanitizeText } from '../../utils/sanitize';

const ITEMS_PER_PAGE = 5;

const InquiryManagement: React.FC = () => {
    const { inquiries, loading, error, deleteInquiry } = useInquiries();
    const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState<EmployerFormData | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(inquiries.length / ITEMS_PER_PAGE);
    const paginatedInquiries = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return inquiries.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [inquiries, currentPage]);

    const handleOpenInquiryModal = (inquiry: EmployerFormData) => {
        setSelectedInquiry(inquiry);
        setIsInquiryModalOpen(true);
    };
    
    const handleDelete = (id?: string) => {
        if (id) {
            deleteInquiry(id);
        }
    }

    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center py-4"><LoaderIcon className="h-6 w-6 mr-2" /> Loading inquiries...</div>;
        }
        if (error) {
            return <div className="text-red-500 text-center py-4">{error}</div>
        }
        if (inquiries.length === 0) {
            return <p className="text-slate-500 text-center py-4">No new inquiries.</p>
        }
        return (
            <>
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {paginatedInquiries.map((inquiry) => (
                            <tr key={inquiry.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark">{sanitizeText(inquiry.companyName)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{sanitizeText(inquiry.contactPerson)}<br /><span className="text-slate-500">{sanitizeText(inquiry.email)}</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{inquiry.submittedAt ? new Date(inquiry.submittedAt).toLocaleDateString() : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={() => handleOpenInquiryModal(inquiry)} className="text-primary hover:text-primary-dark p-1"><span className="sr-only">View</span><BriefcaseIcon className="h-5 w-5" /></button>

                                    <button onClick={() => handleDelete(inquiry.id)} className="text-red-600 hover:text-red-800 p-1"><span className="sr-only">Delete</span><TrashIcon className="h-5 w-5" /></button>
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
            {selectedInquiry && (
                <Modal isOpen={isInquiryModalOpen} onClose={() => setIsInquiryModalOpen(false)} title={`Inquiry: ${sanitizeText(selectedInquiry.companyName)}`}>
                    <div className="space-y-4">
                        <div><strong>Contact Person:</strong> {sanitizeText(selectedInquiry.contactPerson)}</div>
                        <div><strong>Email:</strong> <a href={`mailto:${selectedInquiry.email}`} className="text-primary hover:underline">{sanitizeText(selectedInquiry.email)}</a></div>
                        <div><strong>Phone:</strong> {sanitizeText(selectedInquiry.phone) || 'N/A'}</div>
                        <div><strong>Staffing Needs:</strong><p className="p-2 bg-slate-100 rounded-md whitespace-pre-wrap">{sanitizeText(selectedInquiry.staffingNeed)}</p></div>
                        <div className="text-right text-xs text-slate-500">Submitted: {selectedInquiry.submittedAt ? new Date(selectedInquiry.submittedAt).toLocaleString() : 'N/A'}</div>
                    </div>
                </Modal>
            )}

            <Card>
                <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2"><InboxIcon className="h-6 w-6 text-primary" /> Employer Inquiries ({!loading && inquiries.length})</h2>
                <div className="overflow-x-auto">
                    {renderContent()}
                </div>
            </Card>
        </>
    );
};

export default InquiryManagement;