import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface AdminLoginProps {
    onLogin: (email: string, pass: string) => void;
    error: string;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="bg-light min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-dark">
                        Admin Dashboard Login
                    </h2>
                </div>
                <Card className="!shadow-2xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                        <div>
                            <Button type="submit" className="w-full">
                                Sign in
                            </Button>
                        </div>
                        <p className="text-xs text-slate-500 text-center">Use `admin@primetemp.com` and `password` to sign in.</p>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default AdminLogin;