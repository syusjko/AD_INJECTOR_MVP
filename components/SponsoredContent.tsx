

import React, { useRef } from 'react';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface SponsoredSuggestion {
    suggestionText: string;
    headline: string;
    brandName: string;
    url: string;
    imageUrl: string;
}

interface SponsoredContentProps {
    suggestion: SponsoredSuggestion[] | null;
    isLoading: boolean;
}

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><polyline points="15 18 9 12 15 6"></polyline></svg>
);
const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><polyline points="9 18 15 12 9 6"></polyline></svg>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-full py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
);

const SponsoredContent: React.FC<SponsoredContentProps> = ({ suggestion, isLoading }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.9;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };
    
    if (isLoading) {
        return (
            <div className="bg-gray-50/70 border border-gray-200 rounded-lg p-4 flex flex-col">
                <h3 className="text-md font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <LightbulbIcon />
                    관련 추천 (Sponsored)
                </h3>
                <LoadingSpinner />
            </div>
        );
    }

    if (!suggestion) {
        return null;
    }
    
    return (
        <div className="bg-gray-50/70 border border-gray-200 rounded-lg p-4 flex flex-col animate-fade-in">
             <h3 className="text-md font-semibold text-gray-600 mb-3 flex items-center gap-2">
                <LightbulbIcon />
                관련 추천 (Sponsored)
            </h3>
            <div className="relative">
                {/* FIX: Changed '-ms-overflow-style' to 'msOverflowStyle' to comply with React's camelCase style properties. */}
                <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {suggestion.map((item, index) => {
                        const hostname = item.url ? new URL(item.url).hostname.replace('www.', '') : 'source.com';
                        return (
                            <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                key={index} 
                                className="flex-shrink-0 w-[280px] snap-start bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300 block group"
                            >
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.headline} 
                                    className="w-full h-36 object-cover" 
                                />
                                <div className="p-4 flex flex-col">
                                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">{item.brandName}</p>
                                    <h4 className="font-bold text-gray-800 mt-1 truncate group-hover:text-indigo-700">{item.headline}</h4>
                                    <p className="text-sm text-gray-500 mt-2 h-10 line-clamp-2">{item.suggestionText}</p>
                                    <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400">
                                        <span>{hostname}</span>
                                        <ExternalLinkIcon />
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>
                <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white text-gray-600" aria-label="Scroll left">
                    <ArrowLeftIcon />
                </button>
                <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white text-gray-600" aria-label="Scroll right">
                    <ArrowRightIcon />
                </button>
            </div>
        </div>
    );
};

// CSS for the fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
    }
    .line-clamp-2 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }
`;
document.head.append(style);


export default SponsoredContent;
