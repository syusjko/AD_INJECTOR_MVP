import React from 'react';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><polyline points="15 18 9 12 15 6"></polyline></svg>
);
const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><polyline points="9 18 15 12 9 6"></polyline></svg>
);

interface HeaderProps {
    submittedPrompt: string;
}

const Header: React.FC<HeaderProps> = ({ submittedPrompt }) => {
    return (
        <header className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6 z-10 h-20 shrink-0">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-gray-800 truncate">{submittedPrompt}</h1>
            </div>
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-gray-200 text-gray-500 disabled:text-gray-300" disabled>
                    <ArrowLeftIcon />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-200 text-gray-500 disabled:text-gray-300" disabled>
                    <ArrowRightIcon />
                </button>
                 <button className="p-2 rounded-full hover:bg-gray-200 text-gray-600" aria-label="Close thread">
                    <CloseIcon />
                </button>
            </div>
        </header>
    );
};
export default Header;
