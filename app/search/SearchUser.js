'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { searchuser } from '@/actions/useractions'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';

const SearchUser = ({ initialQuery }) => {
    const { replace, push } = useRouter();
    const [searchTerm, setSearchTerm] = useState(initialQuery || '');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);

    const handleSearch = async (searchTerm) => {
        const query = searchTerm.trim();
        if (query) {
            replace(`search?query=${query}&page=1`);
        } else {
            //  replace(`search`);
            // alert('Please enter a valid search term');
            toast.warn('Please enter something', {
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
        setShowSuggestions(false);
    };

    const fetchSuggestions = async (query) => {
        if (query) {
            try {
                const data = await searchuser(query);
                setSuggestions(data);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(searchTerm);
        }
        else{
            setShowSuggestions(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch(searchTerm);
    };

    useEffect(() => {
        fetchSuggestions(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const clearSearch = () => {
        setSearchTerm('');
        setShowSuggestions(false);
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
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto relative">
            <div className="relative flex flex-1 flex-shrink-0">
                <label htmlFor="search" className="sr-only">Search</label>
                <input
                    id="search"
                    type="text"
                    className="peer bg-gray-800 text-white block w-full rounded-2xl border border-gray-600 py-[9px] pl-10 pr-10 text-sm md:text-base outline-none placeholder:text-gray-500"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onFocus={() => setShowSuggestions(true)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20">
                        <g fill="#e5e7eb">
                            <g transform="scale(8.53333,8.53333)">
                                <path d="M13,3c-5.511,0-10,4.489-10,10c0,5.511,4.489,10,10,10c2.39651,0,4.59738-0.85101,6.32227-2.26367l5.9707,5.9707c0.25082,0.26124,0.62327,0.36648,0.97371,0.27512c0.35044-0.09136,0.62411-0.36503,0.71547-0.71547c0.09136-0.35044-0.01388-0.72289-0.27512-0.97371l-5.9707-5.9707c1.41266-1.72488,2.26367-3.92576,2.26367-6.32227c0-5.511-4.489-10-10-10zM13,5c4.43012,0,8,3.56988,8,8c0,4.43012-3.56988,8-8,8c-4.43012,0-8-3.56988-8-8c0-4.43012,3.56988-8,8-8z"></path>
                            </g>
                        </g>
                    </svg>
                </div>
                {searchTerm && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-200 hover:bg-gray-700 p-2"
                        onClick={clearSearch}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                            <path fill="none" stroke="#e5e7eb" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
            {showSuggestions && suggestions.length > 0 && (
                <div ref={suggestionsRef} className="absolute top-full left-0 w-full bg-gray-800 border border-gray-600 rounded-2xl mt-1 z-10 max-sm:min-w-max">
                    <ul className="text-white overflow-y-auto">
                        {suggestions.slice(0, 5).map((suggestion, index) => (
                            <li key={index} className="flex items-center mx-4 my-2 px-2 py-2 rounded-lg hover:bg-gray-700 cursor-pointer" onClick={async () => {
                                setSearchTerm('');
                                setShowSuggestions(false);
                                 push(`/${suggestion.username}`); // Navigate to /username
                            }}>
                                <img src={suggestion.profilePic} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
                                <div className="text-sm">
                                    <div className="font-medium">{suggestion.name}</div>
                                    <div className="text-gray-400">@{suggestion.username}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {suggestions.length > 5 && (
                        <div className="mx-auto my-2 p-2 rounded-lg text-left text-gray-400 hover:bg-gray-700 overflow-hidden w-[93%] box-border">
                            <button
                                className="rounded-lg text-left text-gray-400 hover:bg-gray-700 overflow-hidden box-border"
                                onClick={() => {
                                    setShowSuggestions(false);
                                    handleSearch(searchTerm);
                                }}
                            >
                                See More
                            </button>
                        </div>
                    )}
                </div>
            )}
        </form>
    </>);
};

export default SearchUser;
