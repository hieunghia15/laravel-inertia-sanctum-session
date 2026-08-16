import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { ValidationError } from 'yup';

import api, { getCsrfCookie } from '@/lib/axios';
import { loginSchema } from '@/lib/validations/auth';
import type { LoginFormData } from '@/lib/validations/auth';

type FormErrors = Partial<Record<keyof LoginFormData, string>>;

export default function Login() {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user modifies the field
        if (errors[name as keyof LoginFormData]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }

        if (generalError) {
            setGeneralError(null);
        }
    };

    const validateForm = async (): Promise<boolean> => {
        try {
            await loginSchema.validate(formData, { abortEarly: false });
            setErrors({});

            return true;
        } catch (err) {
            if (err instanceof ValidationError) {
                const validationErrors: FormErrors = {};

                err.inner.forEach((error) => {
                    if (error.path && !validationErrors[error.path as keyof LoginFormData]) {
                        validationErrors[error.path as keyof LoginFormData] = error.message;
                    }
                });
                setErrors(validationErrors);
            }

            return false;
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setGeneralError(null);

        const isValid = await validateForm();

        if (!isValid) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Ensure CSRF cookie is set for Sanctum session-based authentication
            await getCsrfCookie();

            // Post login credentials to backend
            await api.post('/login', formData);

            // Redirect to dashboard upon successful login
            router.visit('/dashboard');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 422 && err.response.data?.errors) {
                    const serverErrors = err.response.data.errors as Record<string, string[]>;
                    const fieldErrors: FormErrors = {};

                    for (const [key, messages] of Object.entries(serverErrors)) {
                        if (Array.isArray(messages) && messages.length > 0) {
                            fieldErrors[key as keyof LoginFormData] = messages[0];
                        }
                    }

                    setErrors(fieldErrors);
                } else if (err.response?.data?.message) {
                    setGeneralError(err.response.data.message as string);
                } else {
                    setGeneralError('An unexpected error occurred. Please try again.');
                }
            } else {
                setGeneralError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Log in" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 text-zinc-900 sm:px-6 lg:px-8 dark:bg-zinc-950 dark:text-zinc-100">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center">
                        <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200">
                            &larr; Back to home
                        </Link>
                        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Welcome back</h1>
                        <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">Enter your credentials to access your account</p>
                    </div>

                    {/* Card */}
                    <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-xs sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
                        {generalError && (
                            <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                                {generalError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="space-y-4">
                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    placeholder="jane@example.com"
                                    className={`mt-1.5 block w-full rounded-lg border px-3 py-2 text-sm shadow-xs outline-hidden transition placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-900 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-100 ${
                                        errors.email
                                            ? 'border-red-500 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-red-950/20 dark:text-red-100'
                                            : 'border-zinc-300 bg-white text-zinc-900 hover:border-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-zinc-600 dark:focus:border-zinc-100'
                                    }`}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    placeholder="••••••••"
                                    className={`mt-1.5 block w-full rounded-lg border px-3 py-2 text-sm shadow-xs outline-hidden transition placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-900 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-100 ${
                                        errors.password
                                            ? 'border-red-500 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-red-950/20 dark:text-red-100'
                                            : 'border-zinc-300 bg-white text-zinc-900 hover:border-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-zinc-600 dark:focus:border-zinc-100'
                                    }`}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-100 dark:focus:ring-offset-zinc-900"
                                >
                                    {isSubmitting ? (
                                        <span className="inline-flex items-center gap-2">
                                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Logging in...
                                        </span>
                                    ) : (
                                        'Log in'
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-xs text-zinc-600 dark:text-zinc-400">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300">
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
