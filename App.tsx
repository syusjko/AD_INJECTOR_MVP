import React, { useState, useCallback } from 'react';
import { generateTextStream } from './services/geminiService';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ResponseDisplay from './components/ResponseDisplay';
import { MagicIcon } from './components/icons/MagicIcon';
import { GenerateContentResponse } from '@google/genai';


const App: React.FC = () => {
    const [originalPrompt, setOriginalPrompt] = useState<string>('Describe the benefits of drinking coffee in the morning.');
    const [generatedAdInstruction, setGeneratedAdInstruction] = useState<string>('');
    const [originalResponse, setOriginalResponse] = useState<string>('');
    const [adResponse, setAdResponse] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasGenerated, setHasGenerated] = useState<boolean>(false);

    const handleGenerate = useCallback(async () => {
        if (!originalPrompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setHasGenerated(true);
        setError(null);
        setGeneratedAdInstruction('');
        setOriginalResponse('');
        setAdResponse('');

        const adGenerationPrompt = `Analyze the user's prompt below. Based on its core themes, conceptualize a fictional, high-concept brand or product. The brand should feel abstract and aspirational. Then, write a detailed advertising creative brief for this brand in 2-3 sentences. This brief should guide an AI to subtly weave the brand's ethos into a response, rather than directly mentioning a product.

User Prompt: "${originalPrompt}"`;

        try {
            // Helper function to process streams and update state
            const processStream = async (
                streamPromise: Promise<AsyncGenerator<GenerateContentResponse>>,
                stateUpdater: React.Dispatch<React.SetStateAction<string>>
            ): Promise<string> => {
                const stream = await streamPromise;
                let fullText = "";
                for await (const chunk of stream) {
                    const text = chunk.text;
                    if (text) {
                        fullText += text;
                        stateUpdater(prev => prev + text);
                    }
                }
                return fullText;
            };

            // Start both initial generation streams
            const originalStreamPromise = generateTextStream(originalPrompt);
            const adInstructionStreamPromise = generateTextStream(adGenerationPrompt);

            // Process streams concurrently and wait for both to finish
            const [_, adInstructionResult] = await Promise.all([
                processStream(originalStreamPromise, setOriginalResponse),
                processStream(adInstructionStreamPromise, setGeneratedAdInstruction)
            ]);

            // Now that the ad instruction is complete, generate the ad-infused response
            if (adInstructionResult) {
                const modifiedPrompt = `${originalPrompt}\n\n---\n\n**Special Instruction:** Please analyze and subtly integrate the following advertising concept into your response: "${adInstructionResult}"`;
                const adStreamPromise = generateTextStream(modifiedPrompt);
                await processStream(adStreamPromise, setAdResponse);
            }

        } catch (e) {
            console.error(e);
            let errorMessage = 'Failed to generate responses. Please check the console for more details.';
            if (e instanceof Error) {
                errorMessage = e.message;
            }
            setError(errorMessage);
            setHasGenerated(false);
        } finally {
            setIsLoading(false);
        }
    }, [originalPrompt]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            <main className="container mx-auto p-4 md:p-8">
                <Header />

                <div className="mt-8 max-w-3xl mx-auto">
                    <PromptInput
                        id="original-prompt"
                        label="Your Prompt"
                        value={originalPrompt}
                        onChange={(e) => setOriginalPrompt(e.target.value)}
                        placeholder="e.g., Explain the importance of teamwork."
                    />
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
                    >
                        <MagicIcon />
                        {isLoading ? 'Generating...' : 'Generate & Compare'}
                    </button>
                </div>
                
                {error && (
                    <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center max-w-3xl mx-auto">
                        {error}
                    </div>
                )}

                {hasGenerated && (
                  <div className="mt-12 space-y-8">
                      <div>
                          <ResponseDisplay
                              title="Creatively Generated Ad Instruction"
                              content={generatedAdInstruction}
                              isLoading={isLoading}
                          />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <ResponseDisplay
                              title="Standard Response"
                              content={originalResponse}
                              isLoading={isLoading}
                          />
                          <ResponseDisplay
                              title="Ad-Infused Response"
                              content={adResponse}
                              isLoading={isLoading && !!generatedAdInstruction}
                          />
                      </div>
                  </div>
                )}
            </main>
        </div>
    );
};

export default App;