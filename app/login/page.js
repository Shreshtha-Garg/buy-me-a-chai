'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn} from "next-auth/react";
import { useRouter } from 'next/navigation';

const Login = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        document.title = "Login | Buy Me A Chai";
        if (session) {
            router.push('/' + session.user.username);
        }
    }, [session, router]);

    const handleSignIn = async () => {
        const result = await signIn("github");
        if (result && !result.error && session) {
            router.push('/' + session.user.username);
        } else {
            console.error("Sign-in failed:", result?.error ?? "Unknown error");
        }
    };

    const handleEmailSignIn = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password
            });

            if (result?.error) {
                setError(result.error);
            }
        } catch (error) {
            setError("Unknown error");
        }
    };

    return (
        <div>
            <div id="login-popup" tabIndex="-1"
                className="bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[500] h-full flex items-center justify-center">
                <div className="relative p-4 w-full max-w-md">
                    <div className="relative bg-white rounded-lg shadow">
                        <Link href={"/"}>
                            <button type="button"
                                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center popup-close">
                                <svg
                                    aria-hidden="true" className="w-5 h-5" fill="#c6c7c7" viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"></path>
                                </svg>
                                <span className="sr-only">Close popup</span>
                            </button>
                        </Link>

                        <div className="p-5">
                            <div className="text-center">
                                <p className="mb-3 text-2xl font-semibold leading-5 text-slate-900">
                                    Login to your account
                                </p>
                                <p className="mt-2 text-sm leading-4 text-slate-600">
                                    You must be logged in to perform this action.
                                </p>
                            </div>

                            <div className="mt-7 flex flex-col gap-2">
                                <button
                                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:bg-gray-200 focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
                                    onClick={handleSignIn}
                                    title="Sign in with GitHub"
                                >
                                    <img
                                        src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub"
                                        className="h-[18px] w-[18px]" />
                                    Continue with GitHub
                                </button>

                            </div>

                            <div className="flex w-full items-center gap-2 py-6 text-sm text-slate-600">
                                <div className="h-px w-full bg-slate-200"></div>
                                OR
                                <div className="h-px w-full bg-slate-200"></div>
                            </div>

                            <form className="w-full" onSubmit={handleEmailSignIn}>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <input 
                                    name="email" 
                                    type="email" 
                                    autoComplete="email" 
                                    required
                                    className="block w-full rounded-lg border 
                                    text-gray-600 border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                                <label htmlFor="password" className="sr-only">Password</label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        className="password-input mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-600 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div
                                        className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer'
                                        onClick={() => setShowPassword(!showPassword)}
                                        title={showPassword ? "Hide Password" : "Show Password"}
                                    >
                                        {showPassword ? (
                                            <img src="/eye-close.svg" alt="Hide Password" width="24" height="24" />
                                        ) : (
                                            <img src="/eye-open.svg" alt="Show Password" width="24" height="24" />
                                        )}
                                    </div>
                                </div>
                                {error && <p className="text-red-600 mt-2">{error}</p>}
                                <p className="mb-3 mt-2 text-sm text-gray-500">
                                    <a href="/forgot-password" className="text-blue-800 hover:text-blue-600">Reset your password?</a>
                                </p>
                                <button type="submit"
                                    className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:bg-gray-700 disabled:bg-gray-400">
                                    Continue
                                </button>
                            </form>

                            <div className="mt-6 text-center text-sm text-slate-600">
                                Don't have an account?
                                <a href="/signup" className="font-medium text-[#4285f4]">Sign up</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                /* CSS to hide the Edge's built-in password toggle */
                .password-input::-ms-reveal,
                .password-input::-ms-clear {
                    display: none;
                }

                /* Hide the built-in password toggle for Chrome, Safari, and Edge (Chromium-based) */
                .password-input::-webkit-credentials-auto-fill-button,
                .password-input::-webkit-autofill-button,
                .password-input::-webkit-autofill {
                    display: none !important;
                }
            `}</style>
        </div>
    );
}

export default Login;
