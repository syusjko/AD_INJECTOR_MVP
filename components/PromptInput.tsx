import React from 'react';
import { ArrowUpIcon } from './icons/ArrowUpIcon';

interface PromptInputProps {
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
    onGenerate: () => void;
    isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ id, value, onChange, placeholder, onGenerate, isLoading }) => {
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isLoading) {
                onGenerate();
            }
        }
    };
    
    return (
        <div className="relative w-full">
            <textarea
                id={id}
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={1}
                className="w-full p-4 pr-16 text-lg bg-white border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none overflow-hidden"
            />
            <button
                onClick={onGenerate}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-12 my-auto mr-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                aria-label="Generate response"
            >
                {isLoading ? 
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : 
                    <ArrowUpIcon />
                }
            </button>
        </div>
    );
};

export default PromptInput;