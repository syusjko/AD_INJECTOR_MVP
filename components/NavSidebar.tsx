import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { DiscoverIcon } from './icons/DiscoverIcon';
import { LibraryIcon } from './icons/LibraryIcon';
import { SignInIcon } from './icons/SignInIcon';

const NavSidebar: React.FC = () => {
    return (
        <nav className="fixed top-0 left-0 h-screen bg-stone-50 p-4 flex flex-col z-20 transition-all duration-300 ease-in-out w-20 hover:w-64 group group-hover:shadow-xl border-r border-stone-200">
            <div className="flex items-center gap-2 mb-8 shrink-0">
                <svg className="h-8 w-8 text-indigo-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M11.25 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S16.635 2.25 11.25 2.25zm0 1.5a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5z" clipRule="evenodd" />
                    <path d="M12.75 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
                <span className="font-bold text-xl text-gray-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-150">optillm</span>
            </div>
            
            <button className="w-full text-left px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-stone-200 transition-colors flex items-center gap-3">
                <span className="shrink-0">+</span>
                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-150">New Thread</span>
            </button>

            <ul className="space-y-2 mt-6">
                <li>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 font-medium rounded-md hover:bg-stone-200">
                        <HomeIcon /> <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-150">Home</span>
                    </a>
                </li>
                 <li>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 font-medium rounded-md hover:bg-stone-200">
                        <DiscoverIcon /> <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-150">Discover</span>
                    </a>
                </li>
                 <li>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 font-medium rounded-md hover:bg-stone-200">
                        <LibraryIcon /> <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-150">Library</span>
                    </a>
                </li>
            </ul>
            
            <div className="mt-auto">
                 <ul className="space-y-2">
                    <li>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 font-medium rounded-md hover:bg-stone-200">
                            <SignInIcon /> <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-150">Sign In</span>
                        </a>
                    </li>
                </ul>
                <button className="w-full mt-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors overflow-hidden">
                    <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-150">Sign Up</span>
                </button>
            </div>
        </nav>
    );
};

export default NavSidebar;