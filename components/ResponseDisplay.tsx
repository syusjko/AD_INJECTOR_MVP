import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { SparklesIcon } from './icons/SparklesIcon';

interface ResponseDisplayProps {
    title: string;
    content: string;
    isLoading: boolean;
    thinkingSteps: string[];
}

interface ThinkingIndicatorProps {
    steps: string[];
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ steps }) => {
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        // Reset index if steps array changes
        setStepIndex(0);
    }, [steps]);

    useEffect(() => {
        if (steps.length === 0) return;

        const interval = setInterval(() => {
            setStepIndex((prevIndex) => (prevIndex + 1) % steps.length);
        }, 1800);
        return () => clearInterval(interval);
    }, [steps]);

    if (steps.length === 0) {
        return (
             <div className="flex items-center gap-3 text-gray-600 animate-fade-in">
                <SparklesIcon className="w-6 h-6 text-indigo-500 animate-pulse" />
                <span className="font-semibold">결과 생성 중...</span>
            </div>
        );
    }


    return (
        <div className="flex items-center gap-3 text-gray-600 animate-fade-in">
            <SparklesIcon className="w-6 h-6 text-indigo-500 animate-pulse" />
            <span className="font-semibold">{steps[stepIndex]}</span>
        </div>
    );
};


const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ title, content, isLoading, thinkingSteps }) => {
    const parsedContent = content ? marked.parse(content) : '';

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-500 mb-4">{title}</h3>
            <div className="flex-grow prose lg:prose-lg max-w-none prose-p:text-gray-800 prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-strong:font-semibold prose-li:marker:text-gray-500 prose-pre:bg-gray-100 prose-pre:rounded-lg prose-code:text-sm">
                {isLoading && !content ? (
                    <ThinkingIndicator steps={thinkingSteps} />
                ) : (
                    <div 
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: parsedContent || '' }}
                    />
                )}
            </div>
        </div>
    );
};

export default ResponseDisplay;