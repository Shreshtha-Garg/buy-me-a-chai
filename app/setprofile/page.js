'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { updateProfile } from '@/actions/useractions';
import Image from 'next/image';

const SetProfile = () => {
    const router = useRouter();
    const [form, setForm] = useState({
        profilePic: '',
        coverPic: '',
        name: '',
        bio: '',
        razorpay_id: '',
        razorpay_secret: '',
        linkedin: '',
        instagram: '',
        github: ''
    });

    const [showRazorpayId, setShowRazorpayId] = useState(false);
    const [showRazorpaySecret, setShowRazorpaySecret] = useState(false);

    useEffect(() => {
        document.title = "Set Profile | Buy Me A Chai";
        const signupData = sessionStorage.getItem('signupData');
        if (!signupData) {
            alert("You need to sign up first");
            router.push('/signup');
        }
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const signupData = JSON.parse(sessionStorage.getItem('signupData'));
        if (!signupData) {
            alert("You need to sign up first");
            router.push('/signup');
            return;
        }

        // Add username to form
        const updatedForm = { ...form, username: signupData.username, email: signupData.email };

        const response = await updateProfile(updatedForm, signupData.username);
        if (response.success) {
            toast("Profile set up successful, redirecting", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });

            setTimeout(async () => {
                const result = await signIn('credentials', {
                    redirect: false,
                    email: signupData.email,
                    password: signupData.password,
                });

                if (result && !result.error) {
                    router.push('/' + signupData.username);
                } else {
                    alert("Something went wrong during sign in");
                    router.push('/login');
                }
            }, 3000);
        } else {
            toast(response.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce} />
            <div className="flex items-center justify-center min-h-screen bg-[#161a24] p-4">
                <form onSubmit={handleSubmit} className="w-full md:max-w-2xl sm:max-w-lg max-w-md bg-gray-800 p-4 sm:p-6 md:p-8 mt-6 sm:mt-8 md:mt-12 rounded-lg shadow-lg">
                    <div className="mb-6 sm:mb-8 flex justify-between items-center">
                        <h2 className="text-xl sm:text-2xl text-white font-semibold">Set Profile</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="profilePic" className="block text-gray-300 text-sm sm:text-base">Profile Picture:</label>
                            <input value={form.profilePic} onChange={handleChange} type="text" id="profilePic" name="profilePic" className="w-full mt-1 p-2 bg-gray-700 text-gray-300 rounded-lg text-sm sm:text-base" />
                        </div>
                        <div>
                            <label htmlFor="coverPic" className="block text-gray-300 text-sm sm:text-base">Cover Picture:</label>
                            <input value={form.coverPic} onChange={handleChange} type="text" id="coverPic" name="coverPic" className="w-full mt-1 p-2 bg-gray-700 text-gray-300 rounded-lg text-sm sm:text-base" />
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-gray-300 text-sm sm:text-base">Name:</label>
                            <input value={form.name} onChange={handleChange} type="text" id="name" name="name" className="w-full mt-1 p-2 bg-gray-700 text-gray-300 rounded-lg text-sm sm:text-base" placeholder="Enter your name" required />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="bio" className="block text-gray-300 text-sm sm:text-base ">Bio:</label>
                            <textarea value={form.bio} onChange={handleChange} id="bio" name="bio" className="w-full mt-1 p-2 bg-gray-700 text-gray-300 rounded-lg text-sm sm:text-base resize-none" rows="3" placeholder="Something about yourself..."></textarea>
                        </div>
                        <div className="relative">
                            <label htmlFor="razorpay_id" className="block text-gray-300 text-sm sm:text-base">Razorpay ID :</label>
                            <input value={form.razorpay_id} onChange={handleChange} type={showRazorpayId ? 'text' : 'password'} id="razorpay_id" name="razorpay_id" className="w-full mt-1 p-2 bg-gray-700 text-gray-300 rounded-lg text-sm sm:text-base password-input" placeholder="Enter your Razorpay ID" />
                            <div className='absolute top-8 max-sm:top-[26px] right-4 flex items-center cursor-pointer' onClick={() => setShowRazorpayId(!showRazorpayId)} title={showRazorpayId ? "Hide Razorpay ID" : "Show Razorpay ID"}>
                                {showRazorpayId ? (
                                    <div className="tooltip">
                                        <Image src="/eye-close.svg" alt="Show Razorpay ID" width="32" height="32" />
                                    </div>
                                ) : (
                                    <div className="tooltip">
                                        <Image src="/eye-open.svg" alt="Hide Razorpay ID" width="32" height="32" />
                                    </div>
                                )}
                            </div>
                            <style jsx>{`
                                #razorpay_id::-ms-reveal {
                                    display: none;
                                }
                                #razorpay_id::-webkit-textfield-decoration-container {
                                    display: none;
                                }
                            `}</style>
                        </div>
                        <div className="relative">
                            <label htmlFor="razorpay_secret" className="block text-gray-300 text-sm sm:text-base">Razorpay Secret :</label>
                            <input value={form.razorpay_secret} onChange={handleChange} type={showRazorpaySecret ? 'text' : 'password'} id="razorpay_secret" name="razorpay_secret" className="w-full mt-1 p-2 bg-gray-700 text-gray-300 rounded-lg text-sm sm:text-base password-input" placeholder="Enter your Razorpay Secret" />
                            <div className='absolute top-8 max-sm:top-[26px] right-4 flex items-center cursor-pointer' onClick={() => setShowRazorpaySecret(!showRazorpaySecret)} title={showRazorpaySecret ? "Hide Razorpay Secret" : "Show Razorpay Secret"}>
                                {showRazorpaySecret ? (
                                    <div className="tooltip">
                                        <Image src="/eye-close.svg" alt="Show Razorpay Secret" width="32" height="32" />
                                    </div>
                                ) : (
                                    <div className="tooltip">
                                        <Image src="/eye-open.svg" alt="Hide Razorpay Secret" width="32" height="32" />
                                    </div>
                                )}
                            </div>
                            <style jsx>{`
                                #razorpay_secret::-ms-reveal {
                                    display: none;
                                }
                                #razorpay_secret::-webkit-textfield-decoration-container {
                                    display: none;
                                }
                            `}</style>
                        </div>
                        <div>
                            <label htmlFor="linkedin" className="block text-gray-300 text-sm sm:text-base">LinkedIn Profile Link:</label>
                            <input value={form.linkedin} onChange={handleChange} type="text" id="linkedin" name="linkedin" className="w-full mt-1 p-2 bg-gray-700 text-gray-300 rounded-lg text-sm sm:text-base" />
                        </div>
                        <div>
                            <label htmlFor="instagram" className="block text-gray-300 text-sm sm:text-base">Instagram Profile Link:</label>
                            <input value={form.instagram} onChange={handleChange} type="text" id="instagram" name="instagram" className="w-full mt-1 p-2 bg-gray-700 text-gray-300 rounded-lg text-sm sm:text-base" />
                        </div>
                        <div>
                            <label htmlFor="github" className="block text-gray-300 text-sm sm:text-base">GitHub Profile Link:</label>
                            <input value={form.github} onChange={handleChange} type="text" id="github" name="github" className="w-full mt-1 p-2 bg-gray-700 text-gray-300 rounded-lg text-sm sm:text-base" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base transition duration-200">Set Profile</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default SetProfile;
