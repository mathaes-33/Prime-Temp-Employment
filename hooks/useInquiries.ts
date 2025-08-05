
import { useState, useEffect, useCallback } from 'react';
import { EmployerFormData } from '../types';
import * as api from '../src/services/api';

export const useInquiries = () => {
    const [inquiries, setInquiries] = useState<EmployerFormData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInquiries = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const inqs = await api.getInquiries();
            setInquiries(inqs);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch inquiries.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInquiries();
    }, [fetchInquiries]);

    const deleteInquiry = async (id: string) => {
        if(window.confirm('Are you sure you want to delete this inquiry?')) {
            try {
                await api.deleteInquiry(id);
                setInquiries(prev => prev.filter(inq => inq.id !== id));
            } catch (err) {
                console.error(err);
                setError("Failed to delete inquiry.");
            }
        }
    };

    return { inquiries, loading, error, deleteInquiry };
};
