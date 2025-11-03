
import React from 'react';
import Banner from './Banner';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface SponsoredSuggestion {
    suggestionText: string;
    headline: string;
    cta: string;
    url: string;
    imageUrl: string;
}

interface SponsoredContentProps {
    suggestion: SponsoredSuggestion | null;
    isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-full py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
);

const SponsoredContent: React.FC<SponsoredContentProps> = ({ suggestion, isLoading }) => {
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
        return null; // Don't render anything if there's no suggestion and not loading
    }
    
    return (
        <div className="bg-gray-50/70 border border-gray-200 rounded-lg p-4 flex flex-col animate-fade-in">
             <h3 className="text-md font-semibold text-gray-600 mb-3 flex items-center gap-2">
                <LightbulbIcon />
                관련 추천 (Sponsored)
            </h3>
            <div className="space-y-4">
                 {suggestion.imageUrl && (
                    <img 
                        src={suggestion.imageUrl} 
                        alt={suggestion.headline}
                        className="w-full rounded-lg object-cover aspect-video shadow-sm" 
                    />
                 )}
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {suggestion.suggestionText}
                </p>
                <Banner
                    headline={suggestion.headline}
                    cta={suggestion.cta}
                    url={suggestion.url}
                />
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
`;
document.head.append(style);


export default SponsoredContent;