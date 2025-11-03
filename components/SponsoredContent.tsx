import React from 'react';
import Banner from './Banner';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface SponsoredSuggestion {
    suggestionText: string;
    headline: string;
    cta: string;
    url: string;
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
    return (
        <div className="bg-gray-50/70 border border-gray-200 rounded-lg p-4 flex flex-col h-full">
             <h3 className="text-md font-semibold text-gray-600 mb-3 flex items-center gap-2">
                <LightbulbIcon />
                관련 추천 (Sponsored)
            </h3>
            <div className="flex-grow">
                {isLoading ? (
                    <LoadingSpinner />
                ) : suggestion ? (
                    <div className="space-y-4 animate-fade-in">
                        <p className="text-gray-600 whitespace-pre-wrap font-light leading-relaxed text-sm">
                            {suggestion.suggestionText}
                        </p>
                        <Banner
                            headline={suggestion.headline}
                            cta={suggestion.cta}
                            url={suggestion.url}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400 italic text-sm">추천 정보가 여기에 표시됩니다.</p>
                    </div>
                )}
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