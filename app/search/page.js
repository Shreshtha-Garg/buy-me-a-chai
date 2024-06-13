import React from 'react';
import UserList from './UserList';
import SearchUser from './SearchUser';

const YourUserPage = ({ searchParams }) => {
    const query = searchParams.query || '';
    const page = parseInt(searchParams.page, 10) || 1;

    return (
        <div className="overflow-y-auto "> {/* Overlay effect */}
            <div className="bg-[#161a24] px-4 md:px-20 flex justify-center">
                <div className="w-full max-w-2xl">
                    {/* <h1 className="py-8 text-2xl text-white">Matched User :</h1> */}
                    {/* <SearchUser initialQuery={query} /> */}
                    <UserList query={query} page={page} />
                </div>
            </div>
        </div>
    );
};

export default YourUserPage;
