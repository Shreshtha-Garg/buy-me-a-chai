'use client'
import { react, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { fetchuser, updateProfile } from '@/actions/useractions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import Image from 'next/image';
const UpdateProfile = () => {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [showRazorpayId, setShowRazorpayId] = useState(false);
    const [showRazorpaySecret, setShowRazorpaySecret] = useState(false);
    
    const [form, setform] = useState({
        profilePic: '',
        coverPic: '',
        username: '',
        name: '',
        bio: '',
        razorpay_id: '',
        razorpay_secret: '',
        linkedin: '',
        instagram: '',
        github: ''
    });

    useEffect(() => {
        document.title = "Update Profile | Buy Me A Chai";
        if (!session) {
            router.push('/login');
        } else {
            getData();
        }
    }, [router, session]);

    const getData = async () => {
        const user = await fetchuser(session.user.username);
        setform(user);
    }

    const validateUsername = (username) => {
        const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/;
        return usernameRegex.test(username);
    }
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setform({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateUsername(form.username)) {
            toast.warn('Username must be 1-30 characters long and can only contain letters, numbers, periods, and underscores.', {
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
            return;
        }
        const response = await updateProfile(form, session.user.username);
        if (response.success) {
            toast(response.message +", redirecting", {
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
            setTimeout(() => {
                router.push('/' + form.username)
            }, 3000);

            update(); // update session if needed
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
                        <h2 className="text-xl sm:text-2xl text-white font-semibold">Edit Profile</h2>
                        <button type="button" onClick={() => router.push('/' + form.username)}>
                            <img src="/cancel.svg" alt="cancel" className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>
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
                            <label htmlFor="username" className="block text-gray-300 text-sm sm:text-base">Username:</label>
                            <input value={form.username} onChange={handleChange} 
                            required="true" type="text" id="username" name="username" className="w-full mt-1 p-2 bg-gray-700 text-gray-300 rounded-lg text-sm sm:text-base" />
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-gray-300 text-sm sm:text-base">Name:</label>
                            <input value={form.name} onChange={handleChange} type="text" id="name" name="name" className="w-full mt-1 p-2 bg-gray-700 text-gray-300 rounded-lg text-sm sm:text-base" placeholder="Enter your name" 
                            required="true"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="bio" className="block text-gray-300 text-sm sm:text-base ">Bio:</label>
                            <textarea value={form.bio} onChange={handleChange} id="bio" name="bio" className="w-full mt-1 p-2 bg-gray-700 text-gray-300 rounded-lg text-sm sm:text-base resize-none" rows="3" placeholder="Something about yourself..."></textarea>
                        </div>
                        <div className='relative'>
                            <label htmlFor="razorpay_id" className="block text-gray-300 text-sm sm:text-base">Razorpay ID :</label>
                            <input value={form.razorpay_id} onChange={handleChange} type={showRazorpayId ? 'text' : 'password'} id="razorpay_id" name="razorpay_id"  className="w-full mt-1 p-2 bg-gray-700 text-gray-300 rounded-lg text-sm sm:text-base" placeholder="Enter your Razorpay ID" />
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
                        </div>
                        <div className='relative'>
                            <label htmlFor="razorpay_secret" className="block text-gray-300 text-sm sm:text-base">Razorpay Secret :</label>
                            <input value={form.razorpay_secret} onChange={handleChange} type={showRazorpaySecret ? 'text' : 'password'} id="razorpay_secret" name="razorpay_secret" className="w-full mt-1 p-2 bg-gray-700 text-gray-300 rounded-lg text-sm sm:text-base" placeholder="Enter your Razorpay Secret" />
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
                        <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base transition duration-200">Update Profile</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default UpdateProfile;
