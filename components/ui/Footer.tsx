import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-blue-50 border-t border-blue-100 py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-blue-700 font-semibold text-lg">
                    © {new Date().getFullYear()} Phone Store. All Rights Reserved.
                </div>
                <div className="text-gray-500 text-sm">
                    Hotline: <a href="tel:+84123456789" className="hover:text-blue-600">0123.456.789</a> | 
                    Email: <a href="mailto:support@phonestore.com" className="hover:text-blue-600">support@phonestore.com</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;