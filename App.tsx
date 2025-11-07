import React, { useState, useCallback, useRef, useEffect } from 'react';
import { generateTextStream, generateSponsoredSuggestion } from './services/geminiService';
import NavSidebar from './components/NavSidebar';
import PromptInput from './components/PromptInput';
import ResponseDisplay from './components/ResponseDisplay';
import SponsoredContent from './components/SponsoredContent';
import Header from './components/Header';
import { ArrowUpIcon } from './components/icons/ArrowUpIcon';

const App: React.FC = () => {
    const [originalPrompt, setOriginalPrompt] = useState<string>('');
    const [submittedPrompt, setSubmittedPrompt] = useState<string>('');
    const [sponsoredSuggestion, setSponsoredSuggestion] = useState<any[] | null>(null);
    const [originalResponse, setOriginalResponse] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuggestionLoading, setIsSuggestionLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasGenerated, setHasGenerated] = useState<boolean>(false);
    const mainContentRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollTop = mainContentRef.current.scrollHeight;
        }
    }, [originalResponse]);

    const handleGenerate = useCallback(async () => {
        if (!originalPrompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        
        setHasGenerated(true);
        setError(null);
        setSponsoredSuggestion(null);
        setOriginalResponse('');
        setSubmittedPrompt(originalPrompt);

        setIsSuggestionLoading(true);
        let suggestionData: any[] | null = null;
        try {
            suggestionData = await generateSponsoredSuggestion(originalPrompt);
            if (!suggestionData || suggestionData.length === 0) {
                throw new Error("Failed to generate valid sponsored suggestions.");
            }
            setSponsoredSuggestion(suggestionData);
        } catch (err) {
            console.error("Suggestion generation failed:", err);
            setError(err instanceof Error ? `Suggestion Error: ${err.message}` : 'Failed to generate suggestion.');
        } finally {
            setIsSuggestionLoading(false);
        }
        
        setIsLoading(true);
        try {
            let promptToSend = originalPrompt;
            if (suggestionData && suggestionData.length > 0) {
                 promptToSend = `
User prompt: "${originalPrompt}"

---
SYSTEM INSTRUCTION: As part of your response to the user's prompt, you must naturally and seamlessly integrate a helpful mention of the following relevant product. Weave it into the narrative as a practical suggestion or example. Do NOT make it sound like a forced advertisement. Be subtle and helpful.

Product to mention:
- Brand: ${suggestionData[0].brandName}
- Product: ${suggestionData[0].productName}
- Key feature: ${suggestionData[0].suggestionText}
---

Begin your response to the user now.`;
            }

            const stream = await generateTextStream(promptToSend);
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
        <div className="flex h-screen bg-white font-sans">
            <NavSidebar />
            <div className="flex-1 flex flex-col ml-20">
                {hasGenerated && <Header submittedPrompt={submittedPrompt} />}
                <main ref={mainContentRef} className="flex-1 flex flex-col items-center overflow-y-auto">
                    <div className="w-full max-w-4xl flex-grow p-6">
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
                                <div className="mt-6 flex flex-col gap-8">
                                    <ResponseDisplay
                                        title="AI 응답"
                                        content={originalResponse}
                                        isLoading={isLoading}
                                    />
                                    {originalResponse && (
                                        <SponsoredContent
                                            suggestion={sponsoredSuggestion}
                                            isLoading={isSuggestionLoading}
                                        />
                                    )}
                                </div>
                             </div>
                        )}
                    </div>
                    {hasGenerated && (
                        <div className="sticky bottom-0 w-full max-w-4xl bg-white/80 backdrop-blur-sm pt-4 pb-6 px-6">
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
        </div>
    );
};

export default App;
