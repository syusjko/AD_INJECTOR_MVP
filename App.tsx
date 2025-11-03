import React, { useState, useCallback } from 'react';
import { generateTextStream, generateSponsoredSuggestion } from './services/geminiService';
import NavSidebar from './components/NavSidebar';
import PromptInput from './components/PromptInput';
import ResponseDisplay from './components/ResponseDisplay';
import SponsoredContent from './components/SponsoredContent';
import { ArrowUpIcon } from './components/icons/ArrowUpIcon';

const App: React.FC = () => {
    const [originalPrompt, setOriginalPrompt] = useState<string>('');
    const [submittedPrompt, setSubmittedPrompt] = useState<string>('');
    const [sponsoredSuggestion, setSponsoredSuggestion] = useState<any | null>(null);
    const [originalResponse, setOriginalResponse] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuggestionLoading, setIsSuggestionLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasGenerated, setHasGenerated] = useState<boolean>(false);

    const handleGenerate = useCallback(async () => {
        if (!originalPrompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        
        setHasGenerated(true);
        setError(null);
        setSponsoredSuggestion(null);
        setOriginalResponse('');
        setIsLoading(true);
        setIsSuggestionLoading(true);
        setSubmittedPrompt(originalPrompt);

        // --- Concurrent Generation ---

        generateSponsoredSuggestion(originalPrompt)
            .then(suggestion => {
                if (!suggestion?.suggestionText) {
                    throw new Error("Failed to generate a valid sponsored suggestion.");
                }
                setSponsoredSuggestion(suggestion);
            })
            .catch(err => {
                console.error("Suggestion generation failed:", err);
            })
            .finally(() => {
                setIsSuggestionLoading(false);
            });

        try {
            const stream = await generateTextStream(originalPrompt);
            let fullResponse = '';
            for await (const chunk of stream) {
                const text = chunk.text;
                if (text) {
                    fullResponse += text;
                    setOriginalResponse(fullResponse);
                }
            }
        } catch (err) {
            console.error("Stream generation failed:", err);
            setError(err instanceof Error ? err.message : 'Failed to generate response.');
        } finally {
            setIsLoading(false);
        }

    }, [originalPrompt]);

    return (
        <div className="flex min-h-screen bg-white font-sans">
            <NavSidebar />
            <main className="flex-1 p-6 flex flex-col items-center">
                <div className="w-full max-w-4xl flex-grow">
                    {!hasGenerated ? (
                        <div className="max-w-3xl mx-auto pt-20">
                            <h1 className="text-4xl font-bold text-center text-gray-800">무엇이 궁금하신가요?</h1>
                             <div className="mt-8">
                                <PromptInput
                                    id="original-prompt"
                                    value={originalPrompt}
                                    onChange={(e) => setOriginalPrompt(e.target.value)}
                                    placeholder="예: 팀워크의 중요성에 대해 설명해주세요."
                                    onGenerate={handleGenerate}
                                    isLoading={isLoading || isSuggestionLoading}
                                />
                            </div>
                        </div>
                    ) : (
                         <div>
                            <div className="border-b border-gray-200 pb-4">
                               <h1 className="text-2xl font-semibold text-gray-800">{submittedPrompt}</h1>
                            </div>
                            <div className="mt-6 flex flex-col lg:flex-row gap-8">
                                <div className="flex-auto">
                                    <ResponseDisplay
                                        title="AI 응답"
                                        content={originalResponse}
                                        isLoading={isLoading}
                                    />
                                </div>
                                <aside className="w-full lg:w-[320px] lg:flex-shrink-0">
                                    <SponsoredContent
                                        suggestion={sponsoredSuggestion}
                                        isLoading={isSuggestionLoading}
                                    />
                                </aside>
                            </div>
                         </div>
                    )}
                </div>
                {hasGenerated && (
                    <div className="mt-auto pt-6 w-full max-w-4xl">
                         <div className="relative">
                            <input
                                type="text"
                                placeholder="Ask follow-up"
                                disabled
                                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button disabled className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-10 my-auto mr-1.5 bg-gray-200 rounded-full">
                                <ArrowUpIcon />
                            </button>
                        </div>
                    </div>
                )}
                 {error && (
                    <div className="mt-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-center w-full max-w-3xl">
                        {error}
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;