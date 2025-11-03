import React from 'react';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface BannerProps {
    headline: string;
    cta: string;
    url: string;
}

const Banner: React.FC<BannerProps> = ({ headline, cta, url }) => {
    // A simple guard to prevent rendering an invalid banner
    if (!headline || !cta || !url) {
        return null;
    }

    return (
        <div className="bg-gray-900/60 rounded-lg p-4 flex items-center justify-between gap-4 animate-fade-in">
            <div className="flex-1">
                <h4 className="font-semibold text-gray-200">{headline}</h4>
                <p className="text-sm text-gray-400 truncate" title={url}>{url}</p>
            </div>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white font-bold rounded-md hover:bg-indigo-600 transition-all transform hover:scale-105 shadow-md shrink-0"
            >
                <span>{cta}</span>
                <ExternalLinkIcon />
            </a>
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

export default Banner;
