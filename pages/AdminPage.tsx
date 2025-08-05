import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Notification from '../components/ui/Notification';
import { LogOutIcon } from '../components/ui/icons';
import { NotificationType } from '../types';
import AdminLogin from '../components/admin/AdminLogin';
import JobManagement from '../components/admin/JobManagement';
import ApplicationManagement from '../components/admin/ApplicationManagement';
import InquiryManagement from '../components/admin/InquiryManagement';

const AdminPage: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState<NotificationType | null>(null);

    const handleLogin = (email: string, password: string) => {
        // SECURITY WARNING: Hardcoded credentials are a major security risk.
        // In a production environment, this should be handled by a secure authentication
        // service, with secrets stored in environment variables, not in code.
        if (email === 'admin@primetemp.com' && password === 'password') {
            setIsLoggedIn(true);
            setError('');
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };
    
    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    if (!isLoggedIn) {
        return <AdminLogin onLogin={handleLogin} error={error} />;
    }
    
    return (
        <>
            <Notification notification={notification} onDismiss={() => setNotification(null)} />
            
            <div className="bg-light py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-12">
                        <h1 className="text-4xl font-extrabold text-dark">Admin Dashboard</h1>
                        <Button variant="secondary" onClick={handleLogout} className="!px-4 !py-2 flex items-center">
                            <LogOutIcon className="h-5 w-5 mr-2" />
                            Logout
                        </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-10">
                        <JobManagement setNotification={setNotification} />
                        <ApplicationManagement />
                        <InquiryManagement />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPage;