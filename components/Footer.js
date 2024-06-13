import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className=" text-gray-200 flex items-center justify-center px-4 h-16 text-sm sm:text-lg">
            <p className="text-center">Copyright &copy;{currentYear} Get me A Chai -  All rights reserved!! </p>
        </footer>
    );
};

export default Footer;