"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordtype, setPasswordtype] = useState('password');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { data: session, status } = useSession();

    // useEffect(() => {
    //     // If the user is logged in, redirect to their page
    //     // if (status === 'authenticated' && session) {
    //     //     router.push(`/${session.user.username}`);
    //     // }
    // }, [status, session, router]);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
        setPasswordtype(showPassword ? 'password' : 'text');
    };

    const validateUsername = (username) => {
        const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/;
        return usernameRegex.test(username);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,30}$/;
        return passwordRegex.test(password);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateUsername(username)) {
            setError('Username must be 1-30 characters long and can only contain letters, numbers, periods, and underscores.');
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be 4-30 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character.');
            return;
        }

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                // Temporarily store the user data and redirect to SetProfile page
                sessionStorage.setItem('signupData', JSON.stringify({ email, username, password }));
                router.push('/setprofile');
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (err) {
            setError('Something went wrong');
        }
    };

    return (
        <div className="overflow-y-auto mt-[10vh]">
            <div className="bg-[#161a24] px-4 md:px-20 flex justify-center">
                <div className="w-full max-w-2xl">
                    <div className="relative bg-white rounded-lg shadow p-5">
                        <div className="text-center">
                            <p className="mb-3 text-2xl font-semibold leading-5 text-slate-900">
                                Create a new account
                            </p>
                        </div>

                        <form className="mt-7 flex flex-col gap-2" onSubmit={handleSignup}>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block text-gray-600 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1 text-sm md:text-base"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="block w-full text-gray-600 rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1 text-sm md:text-base"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <label htmlFor="password" className="sr-only">Password</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={passwordtype}
                                    autoComplete="current-password"
                                    required
                                    className="block w-full text-gray-600 rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1 text-sm md:text-base password-input"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className='absolute inset-y-0 right-4 flex items-center cursor-pointer' onClick={handleClickShowPassword}>
                                    {showPassword ? (
                                        <Image src="/eye-open.svg" alt="Show password" width="32" height="32" />
                                    ) : (
                                        <Image src="/eye-close.svg" alt="Hide password" width="32" height="32" />
                                    )}
                                </div>
                            </div>
                            {error && <p className="mt-2 text-xs md:text-sm text-red-600">{error}</p>}
                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm md:text-base font-medium text-white outline-none focus:bg-gray-700 disabled:bg-gray-400 mt-4"
                            >
                                Sign Up
                            </button>
                        </form>

                        <div className="mt-6 text-center text-xs md:text-sm text-slate-600">
                            Already have an account?
                            <a href="/login" className="font-medium text-[#4285f4]">Log in</a>
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
            `}</style>
        </div>
    );
};

export default Signup;
