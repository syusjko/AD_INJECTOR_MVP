import React from 'react';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface BannerProps {
    headline: string;
    cta: string;
    url: string;
}

const Banner: React.FC<BannerProps> = ({ headline, cta, url }) => {
    if (!headline || !cta || !url) {
        return null;
    }

    return (
        <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-lg p-4 shadow-sm flex flex-col items-start justify-between gap-3 border border-gray-200">
            <div className="w-full">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">스폰서 추천 정보</p>
                <h4 className="text-lg font-bold text-gray-800 mt-1">{headline}</h4>
            </div>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-sm"
            >
                <span>{cta}</span>
                <ExternalLinkIcon />
            </a>
        </div>
    );
};

export default Banner;