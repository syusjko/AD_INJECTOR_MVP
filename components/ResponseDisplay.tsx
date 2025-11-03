
import React from 'react';

interface ResponseDisplayProps {
    title: string;
    content: string;
    isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ title, content, isLoading }) => {
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg p-6 flex flex-col h-full min-h-[300px]">
            <h3 className="text-xl font-bold text-indigo-400 mb-4">{title}</h3>
            <div className="flex-grow overflow-y-auto">
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <p className="text-gray-300 whitespace-pre-wrap font-light leading-relaxed">
                        {content || 'Response will appear here...'}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ResponseDisplay;
