'use client'
import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { initiate, fetchpayments, fetchuser } from '@/actions/useractions';
import { useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { fetchLastFourUsersExceptCurrent } from '@/actions/useractions';
const PaymentPage = ({ username }) => {
    const { data: session } = useSession(); // Fetch session data
    const [paymentform, setPaymentform] = useState({ name: '', message: '', amount: '' });
    const [currentUser, setcurrentUser] = useState({});
    const [payments, setPayments] = useState([]);
    const [userNotFound, setUserNotFound] = useState(false);
    const [dataFetched, setdataFetched] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await fetchLastFourUsersExceptCurrent(username);
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [username]);

    useEffect(() => {
        const getData = async () => {
            try {
                let u = await fetchuser(username);
                if (!u) {
                    setUserNotFound(true);
                } else {
                    setcurrentUser(u);
                    let dbpayments = await fetchpayments(username);
                    setPayments(dbpayments);
                    // console.log('Payments:', dbpayments);
                    // console.log('u:', u);
                    // alert("found user and payments")
                }
                setTimeout(() => {
                    setdataFetched(true);
                    // alert('data fetched set to true')
                }, 200);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getData();
    }, [username, searchParams]);

    useEffect(() => {
        const paymentDone = searchParams.get("paymentdone");
        if (paymentDone === "true") {
            toast('Thanks for the Payment', {
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
            router.push('/' + username);
        }
    }, [searchParams]);


    useEffect(() => {
        if (userNotFound) {
            toast.error('No user with this username !!! Redirecting to homepage', {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        }
    }, [userNotFound]);

    useEffect(() => {
        if (session && session.user.username === username) {
            const promotion = document.querySelector('.promotion');
            const makePayment = document.querySelector('.makePayment');
            const supporterstats = document.querySelector('.supporter-stats');
            if (promotion) {
                promotion.classList.replace('hidden', 'flex');
            }
            if (supporterstats) {
                supporterstats.classList.replace('hidden', 'flex');
            }
            if (makePayment) {
                makePayment.classList.add('hidden');
            }
        }
    }, [session, username]);

    const handlechange = (e) => {
        setPaymentform({ ...paymentform, [e.target.name]: e.target.value });
    };

    const calculateTotalAndAverage = () => {
        let totalAmount = 0;
        payments.forEach(payment => {
            totalAmount += payment.amount;
        });
        const averageDonation = payments.length > 0 ? parseFloat(totalAmount / payments.length).toFixed(2) : 0;
        return { totalAmount, averageDonation };
    };

    const pay = async (amount) => {
        let amountInPaise = amount * 100;

        if (!paymentform.name) {
            // alert('Please provide your name');
            toast.warn('Please provide your name', {
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

        try {
            let a = await initiate(amountInPaise, username, paymentform);
            let orderId = a.id;
            const options = {
                key: currentUser.razorpay_id, // Use the public environment variable
                amount: (amountInPaise).toString(), // Amount is in paisa
                currency: 'INR',
                name: 'Get Me A Chai',
                description: 'Test Transaction',
                image: 'https://example.com/your_logo',
                order_id: orderId, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                callback_url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/razorpay`,
                prefill: {
                    name: paymentform.name, // Your customer's name
                    email: "",
                    contact: '9000090000', // Provide the customer's phone number for better conversion rates
                },
                notes: {
                    address: 'Razorpay Corporate Office',
                },
                theme: {
                    color: '#3399cc',
                },
            };
            // console.log('Options:', options);
            var rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                // alert(response.error.description);
                toast.error(response.error.description, {
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
            });

            rzp1.open();
        } catch (error) {
            console.error('Error in payment process:', error);
            // alert('Error in payment process. Please try again.');
            toast.error('Error in payment process. Please try again.', {
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
        }
    };
    // if (!dataFetched) {
    //     return (

    //     );
    // }
    if (userNotFound) {
        return (
            <><ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce} />
                <div className="my-4 flex items-center justify-center text-red-500">
                    No user exists with this username !!!
                </div>
            </>
        );
    }
    else
        return (
            <> 
                {dataFetched?(""):(<div className='h-[100vh] w-full z-[1000] fixed bg-[#161a24]'>
                    <div className="my-4 flex items-center justify-center h-[50vh]">
                        <img src="/output-onlinegiftools.gif" alt="Loading" className="md:size-40 size-32" />
                    </div>
                </div>)}
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
                <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

                <div className='relative'>
                    <div className="dashboard">
                        <div className="user_img">
                            <div className="relative w-full overflow-hidden aspect-[3/1] min-[576px]:aspect-[4/1]">
                                {currentUser.coverPic ? (
                                    <img src={currentUser.coverPic} alt="Cover Picture" className="absolute top-0 left-0 w-full h-full object-cover transform duration-300 hover:scale-150" id='coverPic' />
                                ) : (
                                    <img src="/chai-cover-pic.jpg" alt="Cover Picture" className="absolute top-0 left-0 w-full h-full object-cover" />
                                )}

                            </div>
                            <div className="relative flex flex-col items-center justify-center px-6 pb-8 mx-auto -mt-16 w-full border-b-[0.5px] border-opacity-50 border-gray-50">
                                {currentUser.profilePic ? (<img src={currentUser.profilePic} alt="Profile Picture" className="w-32 h-32 rounded-full mb-4" id='profilePic' />) : (<img src="/fan-avatar-2.gif" alt="Profile Picture" className="w-32 h-32 rounded-full mb-4" id='profilePic' />)}
                                <div className='flex items-center justify-center flex-col'>
                                    <h1 className="text-3xl font-medium mb-0.5">{currentUser.name}</h1>
                                    <p className="text-base mb-2 text-gray-400">{username}</p>
                                    <p className="text-gray-100 mb-3 text-base sm:text-sm text-center">{currentUser.bio}</p>
                                    <div className="text-gray-400 mb-4 text-sm">
                                        <span>
                                            <span className="font-medium">{payments.length}</span> Payments
                                        </span>
                                        <span className="mx-2">•</span>
                                        <span>
                                            {/* totalAmount raised */}
                                            <span className="font-medium">₹{calculateTotalAndAverage().totalAmount}</span> Raised
                                        </span>
                                    </div>
                                    {(() => {
                                        // console.log(session.user.username);
                                        if (!session) {
                                            return (<> <Link href={"/login"}>
                                                <button className="bg-gray-100 text-gray-900 w-52 py-2 px-5 rounded-lg hover:bg-gray-200 font-bold cursor-pointer" onClick={() => { }}>Join for free</button></Link>
                                            </>)
                                        }
                                        else if (session && session.user.username == username) {
                                            return (
                                                <>
                                                    <Link href={'/updateprofile'}>
                                                        <button className="bg-gray-100 text-gray-900 w-52 py-2 px-5 rounded-lg hover:bg-gray-200 font-bold cursor-pointer" >Edit Profile</button></Link>
                                                </>)
                                        }

                                    })()}

                                    {/* all social media svgs */}
                                    <div className="social_media flex flex-row space-x-4 mt-4 ">
                                        {currentUser.instagram ? (<Link href={currentUser.instagram ? currentUser.instagram : ""}>
                                            {/* <!-- Instagram --> */}
                                            <span className="[&>svg]:h-6 [&>svg]:w-6">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 448 512">
                                                    <path
                                                        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                                                </svg>
                                            </span>

                                        </Link>) : ("")}

                                        {currentUser.linkedin ? (<Link href={currentUser.linkedin ? currentUser.linkedin : ""}>
                                            {/* <!-- Linkedin --> */}
                                            <span className="[&>svg]:h-6 [&>svg]:w-6">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 448 512">
                                                    <path
                                                        d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                                                </svg>
                                            </span>

                                        </Link>) : ("")}

                                        {currentUser.github ? (<Link href={currentUser.github ? currentUser.github : ""}>
                                            {/* <!-- Github --> */}
                                            <span className="[&>svg]:h-6 [&>svg]:w-6">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 496 512">
                                                    <path
                                                        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                                                </svg>
                                            </span>
                                        </Link>) : ("")}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full justify-center items-center py-6 sm:py-10">
                            <div className="payment flex flex-col lg:flex-row justify-center gap-3 lg:gap-5 2xl:gap-8 w-[90%] sm:w-[80%] lg:w-[90%] md:mt-11 mt-5 sm:mt-8">
                                <div className="supporters h-fit w-full lg:w-1/2 bg-slate-800 rounded-lg text-white p-5 sm:p-10">
                                    {/* Show list of all the supporters as a leaderboard */}
                                    <h2 className="text-lg sm:text-2xl font-bold my-3 sm:my-5">Top supporters</h2>
                                    <ul className="mx-3 sm:mx-5 text-xs sm:text-sm lg:text-base min-[2000px]:text-lg">
                                        {(() => {
                                            const renderedPayments = [];
                                            const maxEntries = 3;
                                            if (payments.length == 0) {
                                                // no payments yet 

                                                return (<li className="my-2 sm:my-4 flex gap-2 items-center">
                                                    <span>
                                                        <span className="font-semibold">No payments yet</span>
                                                        <span className="text-gray-200">,
                                                            {(session && session.user.username === username) ? (" share your payment link to get donations") : (" Be the first one to donate")}
                                                        </span>
                                                    </span>
                                                </li>)
                                            }
                                            for (let i = 0; i < Math.min(maxEntries, payments.length); i++) {
                                                const p = payments[i];
                                                renderedPayments.push(
                                                    <li key={i} className="my-2 sm:my-4 flex gap-2 items-center lg:mt-8 mt-4">
                                                        <img className="w-6 sm:w-8 rounded-full" src="/fan-avatar-2.gif" alt="user avatar" />
                                                        <span>
                                                            <span className="font-semibold">{p.name} </span>
                                                            donated <span className="font-semibold text-green-700">₹{p.amount}</span> with a message <span className="font-semibold">"{p.message ? p.message : "Have a Chai"}"</span>
                                                        </span>
                                                    </li>
                                                );
                                            }
                                            return renderedPayments;
                                        })()}
                                    </ul>
                                    <div className="supporter-stats hidden flex-col items-center bg-[rgb(41,53,72)]  shadow-lg rounded-lg text-white p-5 sm:p-10 mt-5 lg:mt-10 transform transition duration-300 hover:scale-105">
                                        <h2 className="text-lg sm:text-2xl font-bold mb-5">Supporters Stats</h2>
                                        <div className="flex flex-col items-center ">
                                            {(() => {
                                                const { totalAmount, averageDonation } = calculateTotalAndAverage();
                                                return (<>
                                                    <p className="text-base sm:text-lg mb-3 text-center">Total Money Received: <span className="font-semibold text-green-500">₹{totalAmount}</span></p>
                                                    <p className="text-base sm:text-lg mb-3 text-center">Total Number of Payments: <span className="font-semibold text-green-500">{payments.length}</span></p>
                                                    <p className="text-base sm:text-lg mb-3 text-center">Average Donation per transaction: <span className="font-semibold text-green-500">₹{averageDonation}</span></p>
                                                </>);
                                            })()}

                                        </div>

                                    </div>
                                </div>
                                {currentUser.razorpay_id ? (<div className="makePayment w-full lg:w-1/2 bg-slate-800 rounded-lg text-white p-5 sm:p-10 mt-5 lg:mt-0 text-xs sm:text-sm 2xl:text-base ">
                                    <h2 className="text-lg sm:text-2xl font-bold my-3 sm:my-5">Make a Payment</h2>
                                    <div className="flex flex-col sm:flex-row gap-2 2xl:gap-4">
                                        <div className="w-full">
                                            <input
                                                type="text"
                                                className="w-full p-2 md:p-3 rounded-lg bg-slate-700 hover:bg-slate-600 "
                                                placeholder="Enter Name"
                                                value={paymentform.name}
                                                onChange={handlechange}
                                                name='name'
                                            />
                                        </div>
                                        <div className="w-full">
                                            <input
                                                type="text"
                                                className="w-full p-2 md:p-3 rounded-lg bg-slate-700 hover:bg-slate-600"
                                                placeholder="Enter Message"
                                                value={paymentform.message}
                                                onChange={handlechange}
                                                name='message'
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-4 2xl:gap-8 mt-5">
                                        <input
                                            type="text"
                                            className="w-full p-2 md:p-3 rounded-lg bg-slate-700 hover:bg-slate-600"
                                            placeholder="Enter Amount"
                                            value={paymentform.amount}
                                            onChange={handlechange}
                                            name='amount'
                                        />
                                        <button className="bg-slate-700 hover:bg-slate-600 p-2 md:p-3 rounded-lg w-1/4 disabled:bg-slate-500 " disabled={paymentform.name?.length < 3 || paymentform.message?.length < 4 || paymentform.amount < 1} onClick={() => pay(Number.parseInt(paymentform.amount))}>Pay</button>
                                    </div>
                                    <div className="flex flex-row gap-2 2xl:gap-4 mt-5">
                                        <button className="bg-slate-700 hover:bg-slate-600 2xl:p-4 p-2.5 rounded-lg w-full" onClick={() => pay(50)}>Donate ₹50</button>
                                        <button className="bg-slate-700 hover:bg-slate-600 2xl:p-4 p-2.5 rounded-lg w-full" onClick={() => pay(100)}>Donate ₹100</button>
                                        <button className="bg-slate-700 hover:bg-slate-600 2xl:p-4 p-2.5 rounded-lg w-full" onClick={() => pay(500)}>Donate ₹500</button>
                                    </div>
                                </div>) : (
                                    //show that this user has not set up payment yet
                                    <div className="makePayment w-full lg:w-1/2 bg-slate-800 rounded-lg text-white p-5 sm:p-10 mt-5 lg:mt-0 text-xs sm:text-sm 2xl:text-base ">
                                        <h2 className="text-lg sm:text-2xl font-bold my-3 sm:my-5">Make a Payment</h2>
                                        <p className="mx-3 sm:mx-5 text-xs sm:text-sm lg:text-base min-[2000px]:text-lg">This user has not set up payment yet.</p>

                                    </div>
                                )}

                                <div className="promotion hidden flex-col items-center justify-center gap-6 w-full lg:w-1/2 bg-slate-800 rounded-lg text-white py-5 px-1 min-[550px]:px-3 sm:px-5 lg:px-2 xl:px-5 2xl:px-7 sm:pt-10 max-lg:mt-5">
                                    <h2 className="text-lg sm:text-2xl font-bold my-3 sm:my-5 text-left w-full">Featured Users</h2>
                                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-4 xl:gap-[22px] 2xl:gap-7">
                                        {users.map((user) => (
                                            <div key={user._id} className="featured-user flex flex-col items-center px-1 py-3 sm:p-3 lg:px-0.5 lg:py-5 xl:px-3 bg-[rgb(41,53,72)] rounded-lg text-center shadow-lg transform transition duration-300 hover:scale-105 w-[calc(50%-16px)]">
                                                <img className="w-20 h-20 rounded-full mb-3" src={user.profilePic || '/fan-avatar-2.gif'} alt={`${user.name} avatar`} />
                                                <span className="font-semibold text-lg sm:text-xl">{user.name}</span>

                                                <p className="text-gray-200 text-xs sm:text-sm mb-2 text-center">{user.bio}</p>
                                                <button className="mt-2 px-3 py-2 bg-slate-700 rounded-full text-xs sm:text-sm font-semibold hover:bg-[rgb(61,75,95)]
"
                                                    onClick={() => {
                                                        router.push('/' + user.username);
                                                    }}
                                                >View Profile</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
}

export default PaymentPage

export const metadata = ({ username }) => ({
    title: `${username} Payment Page`,
    description: `Make payments to the user ${username}`,
});
