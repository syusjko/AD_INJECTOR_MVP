import React from 'react';
import { marked } from 'marked';

interface ResponseDisplayProps {
    title: string;
    content: string;
    isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
);

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ title, content, isLoading }) => {
    const parsedContent = content ? marked.parse(content) : '';

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-500 mb-4">{title}</h3>
            <div className="flex-grow prose prose-p:text-gray-700 prose-p:leading-relaxed max-w-none">
                {isLoading && !content ? (
                    <LoadingSpinner />
                ) : (
                    <div 
                        className="whitespace-pre-wrap font-light"
                        dangerouslySetInnerHTML={{ __html: parsedContent || (isLoading ? '' : '응답이 여기에 표시됩니다...') }}
                    />
                )}
            </div>
        </div>
    );
};

export default ResponseDisplay;