import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

const Header: React.FC = () => {
    return (
        <header className="text-center">
            <div className="flex items-center justify-center gap-4">
                <SparklesIcon />
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                    Ad Copy Injector
                </h1>
            </div>
            <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
                Write a prompt, and we'll creatively generate an ad concept to inject into the response. 
                Compare the standard and ad-infused results side-by-side.
            </p>
        </header>
    );
};

export default Header;