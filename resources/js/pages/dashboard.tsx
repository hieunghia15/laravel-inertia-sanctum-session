import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

import api from '@/lib/axios';
import type { Auth } from '@/types/auth';

type DashboardProps = {
    auth: Auth;
};

export default function Dashboard({ auth }: DashboardProps) {
    const user = auth.user;
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState<string | null>(null);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        setLogoutError(null);

        try {
            await api.post('/logout');
            router.visit('/');
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setLogoutError(err.response.data.message as string);
            } else {
                setLogoutError('Failed to log out. Please try again.');
            }
        } finally {
            setIsLoggingOut(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 text-zinc-900 sm:px-6 lg:px-8 dark:bg-zinc-950 dark:text-zinc-100">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
                        <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                            Welcome, <span className="font-medium text-zinc-900 dark:text-zinc-200">{user.name}</span>
                        </p>
                    </div>

                    {/* Card */}
                    <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-xs sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
                        {logoutError && (
                            <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                                {logoutError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">User Information</h2>
                                <div className="mt-2 border-t border-zinc-100 dark:border-zinc-800" />
                            </div>

                            <dl className="divide-y divide-zinc-100 text-sm dark:divide-zinc-800">
                                <div className="flex justify-between py-2.5">
                                    <dt className="text-zinc-500 dark:text-zinc-400">ID</dt>
                                    <dd className="font-medium text-zinc-900 dark:text-zinc-100">{user.id}</dd>
                                </div>
                                <div className="flex justify-between py-2.5">
                                    <dt className="text-zinc-500 dark:text-zinc-400">Name</dt>
                                    <dd className="font-medium text-zinc-900 dark:text-zinc-100">{user.name}</dd>
                                </div>
                                <div className="flex justify-between py-2.5">
                                    <dt className="text-zinc-500 dark:text-zinc-400">Email</dt>
                                    <dd className="font-medium text-zinc-900 dark:text-zinc-100">{user.email}</dd>
                                </div>
                            </dl>

                            {/* Logout Action */}
                            <div className="pt-4">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-100 dark:focus:ring-offset-zinc-900"
                                >
                                    {isLoggingOut ? (
                                        <span className="inline-flex items-center gap-2">
                                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Logging out...
                                        </span>
                                    ) : (
                                        'Logout'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
