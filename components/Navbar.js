'use client';
import { useSession, signIn, signOut } from "next-auth/react";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchUser from "@/app/search/SearchUser";
import { fetchuser } from "@/actions/useractions";
const Navbar = () => {
  const { data: session, status } = useSession(); 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({ name: '', profilePic: '' });
  const router = useRouter(); // Initialize the useRouter hook
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    if (session && session.user.username) {
      const fetchUserData = async () => {
        const user = await fetchuser(session.user.username);
        if (user) {
          setUserData({ name: user.name, profilePic: user.profilePic });
        }
      };
      fetchUserData();
    }
  }, [session]);
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' }); // Use callbackUrl to redirect to homepage
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setTimeout(() => {
        setDropdownOpen(false);
      }, 100);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    // Call handleClickOutside when the component mounts
    handleClickOutside();
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const loading = status === "loading"


  return (
    <div>
      <nav className="bg-[#020512] fixed w-full text-gray-200 flex justify-between max-[350px]:px-1 px-2 sm:px-4 md:px-6 h-16 items-center border-b-[0.5px] border-opacity-50 border-gray-50 z-[100]">
        <div className="logo font-bold text-lg md:text-2xl flex items-end justify-center max-[350px]:gap-0 gap-1 sm:gap-2">
          // <button className="md:hidden text-gray-300 focus:outline-none">
          //   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          //   </svg>
          // </button>
          <Link className="flex items-end " href={"/"}>
            <span><img src="/favicon.png" alt="Chai" className="h-10 min-w-10 md:h-12 md:w-12" /></span>
            <span className='text hidden md:flex min-w-fit text-nowrap'>Buy Me a Chai</span>
          </Link>
        </div>
        <div className="flex items-center justify-center mx-4 w-full lg:max-w-lg sm:max-w-sm max-w-xs ">
          {/* <Search placeholder="Search users..." /> */}
          <SearchUser />
        </div>
        <div className="flex min-w-fit">
          {!loading&&( <ul className="flex text-sm lg:text-base">
            {session ? (
              <li className="relative " ref={dropdownRef}>
                <button
                  id="dropdownDefaultButton"
                  onClick={toggleDropdown}
                  className="text-gray-200 focus:outline-none font-medium rounded-3xl text-sm mx-5 my-2.5 text-center inline-flex items-center "
                  type="button"
                >
                  <img src={userData.profilePic ? userData.profilePic : "/fan-avatar-2.gif"} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                  <svg
                    className="w-2.5 h-2.5 ml-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div id="dropdown" className="absolute z-[100] top-[110%] right-[20%] mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow w-56 dark:bg-gray-800">
                    <div className="flex items-center p-4 gap-1">
                      <img src={userData.profilePic ? userData.profilePic : "/fan-avatar-2.gif"} alt="Profile" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-2" />
                      <span className="text-base font-medium text-gray-700 dark:text-gray-200">{userData.name?userData.name : session.user.username}</span>
                    </div>
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                      <li>
                        <Link onClick={() => {
                          setTimeout(() => {
                            router.push('/' + session.user.username);
                            setDropdownOpen(false);
                          }, 100);
                        }} href={''} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                          Your Profile
                        </Link>
                      </li>
                      <li>
                        <Link onClick={() => {
                          setTimeout(() => {
                            router.push('/')
                            setDropdownOpen(false);
                          }, 100);
                        }} href={''} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link onClick={() => {
                          setTimeout(() => {
                            router.push('/about');
                            setDropdownOpen(false);
                          }, 100);
                        }} href={''} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                          About Us and Contact
                        </Link>
                      </li>
                      <li className="block pl-4 py-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 border-t-[0.5px] border-opacity-50 border-gray-50 ">
                        <button className="w-full text-left" onClick={handleSignOut}>Sign Out</button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            ) : (
              <>
                <li className="sm:mr-3">
                  <Link href={"/login"}>
                    <button type="button" className="text-gray-200 bg-transparent hover:bg-[#4a657d] focus:bg-[#3b4f63] focus:outline-none font-medium rounded-3xl text-sm sm:px-5 px-2.5 sm:py-2.5 py-2 text-center inline-flex items-center">
                      Log in
                    </button>
                  </Link>
                </li>
                <li className="sm:mr-3">
                  <Link href={"/signup"}>
                    <button type="button" className="text-gray-200 bg-[#3b4f63] hover:bg-[#4a657d] focus:bg-[#3b4f63] focus:outline-none font-medium rounded-3xl text-sm sm:px-5 px-2.5 sm:py-2.5 py-2 text-center inline-flex items-center dark:bg-[#2f3e50] dark:hover:bg-[#4a657d] dark:focus:bg-[#3b4f63]">
                      Sign Up
                    </button>
                  </Link>
                </li>
              </>
            )}
          </ul>)}
        </div>
      </nav>

    </div>
  );
};

export default Navbar;
