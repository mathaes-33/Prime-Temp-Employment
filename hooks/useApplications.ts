
import { useState, useEffect, useCallback } from 'react';
import { EmployeeFormData } from '../types';
import * as api from '../src/services/api';

export const useApplications = () => {
    const [applications, setApplications] = useState<EmployeeFormData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchApplications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const apps = await api.getApplications();
            setApplications(apps);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch applications.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const deleteApplication = async (id: string) => {
        if(window.confirm('Are you sure you want to delete this application?')) {
            try {
                await api.deleteApplication(id);
                setApplications(prev => prev.filter(app => app.id !== id));
            } catch (err) {
                console.error(err);
                setError("Failed to delete application.");
            }
        }
    };

    return { applications, loading, error, deleteApplication };
};
