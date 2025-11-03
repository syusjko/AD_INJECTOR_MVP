
import React from 'react';

interface PromptInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
}

const PromptInput: React.FC<PromptInputProps> = ({ id, label, value, onChange, placeholder }) => {
    return (
        <div className="w-full">
            <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>
            <textarea
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={5}
                className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-y"
            />
        </div>
    );
};

export default PromptInput;
