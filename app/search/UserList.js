import React from 'react';
import { searchuser } from '@/actions/useractions';
import Link from 'next/link';
import { fetchpayments } from '@/actions/useractions';

const UserList = async ({ query, page }) => {
    const usersPerPage = 5;
    const fetchedUsers = await searchuser(query);
    const totalUsers = fetchedUsers.length;
    const totalPages = Math.ceil(totalUsers / usersPerPage);

    const indexOfLastUser = page * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = fetchedUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPayments = async (username) => {
        try {
            // Fetch the payments
            const payments = await fetchpayments(username);
            // Sum all the payments
            let total = 0;
            payments.forEach(payment => {
                total += payment.amount;
            });
            return total;
        } catch (error) {
            console.error('Error fetching payments:', error);
            return 0;
        }
    };
    const noOfPayments = async (username) => {
        try {
            // Fetch the payments
            const payments = await fetchpayments(username);
            return payments.length;
        } catch (error) {
            console.error('Error fetching payments:', error);
            return 0;
        }
    };
    
    return (
        <div className=''>
            <h1 className="py-8 text-2xl text-white">{currentUsers.length} Matched Users :</h1>
            {currentUsers.length === 0 && (
                <>
                    <p className="mt-4 font-semibold text-lg">No users found matching <span className='font-semibold'>'{query}'</span></p>
                    <p className="text-gray-400 text-sm mt-2">Try searching for something else, or</p>
                    <ul 
                        className="text-gray-400 text-sm mt-2 list-disc list-inside"
                    >
                    <li className='mt-2'>Search for the user's name or their username.</li>
                    <li className='mt-2'>Check your spelling.</li>
                    <li className='mt-2'>Try more general words.</li>
                    </ul>
                    </>
            )}
            <div className="flex flex-col mt-6">
                {currentUsers.map((user) => (
                    <Link key={user._id} href={`/${user.username}`}>
                        <div
                            className="flex flex-col p-3 lg:p-4 bg-gray-800 shadow-md rounded-lg mb-3 lg:mb-4 transform transition duration-300 hover:scale-[1.025] text-sm sm:text-base"
                        >
                            <div className="flex space-x-4 lg:space-x-6 items-center">
                                <img
                                    src={user.profilePic || '/fan-avatar-2.gif'}
                                    alt={user.username}
                                    width={75}
                                    height={75}
                                    className="rounded-full lg:w-24 lg:h-24"
                                />
                                <div>
                                    <h2 className="text-lg lg:text-xl font-bold text-white">{user.username}</h2>
                                    <p className="text-gray-400 text-xs lg:text-sm">{user.bio}</p>
                                    <p className="text-xs text-gray-400 lg:text-sm">
                                        <span>
                                            <span className="font-medium">{noOfPayments(user.username)}</span> Payments
                                        </span>
                                        <span className="mx-2">•</span>
                                        <span>
                                            {/* totalAmount raised */}
                                            <span className="font-medium">₹{totalPayments(user.username)}</span> Raised
                                        </span></p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <Link
                        href={`?query=${query}&page=${Math.max(page - 1, 1)}`}
                        className={`px-3 lg:px-4 py-1 lg:py-2 bg-gray-800 text-white rounded-l-lg ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Previous
                    </Link>
                    {[...Array(totalPages).keys()].map((_, index) => (
                        <Link
                            key={index + 1}
                            href={`?query=${query}&page=${index + 1}`}
                            className={`px-3 lg:px-4 py-1 lg:py-2 ${page === index + 1 ? 'bg-gray-600' : 'bg-gray-800'} text-white`}
                        >
                            {index + 1}
                        </Link>
                    ))}
                    <Link
                        href={`?query=${query}&page=${Math.min(page + 1, totalPages)}`}
                        className={`px-3 lg:px-4 py-1 lg:py-2 bg-gray-800 text-white rounded-r-lg ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Next
                    </Link>
                </div>
            )}
        </div>
    );
};

export default UserList;
