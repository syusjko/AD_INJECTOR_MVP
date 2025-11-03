import React, { useState, useCallback } from 'react';
import { generateTextStream, generateAdCreative } from './services/geminiService';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ResponseDisplay from './components/ResponseDisplay';
import Banner from './components/Banner';
import { MagicIcon } from './components/icons/MagicIcon';
import { GenerateContentResponse } from '@google/genai';


const App: React.FC = () => {
    const [originalPrompt, setOriginalPrompt] = useState<string>('Describe the benefits of drinking coffee in the morning.');
    
    // State for Ad Creative
    const [brandName, setBrandName] = useState<string>('');
    const [generatedAdInstruction, setGeneratedAdInstruction] = useState<string>('');
    const [bannerHeadline, setBannerHeadline] = useState<string>('');
    const [ctaText, setCtaText] = useState<string>('');
    const [websiteUrl, setWebsiteUrl] = useState<string>('');

    // State for Responses
    const [originalResponse, setOriginalResponse] = useState<string>('');
    const [adResponse, setAdResponse] = useState<string>('');
    
    // UI State
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasGenerated, setHasGenerated] = useState<boolean>(false);

    const handleGenerate = useCallback(async () => {
        if (!originalPrompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        
        // Reset states
        setIsLoading(true);
        setHasGenerated(true);
        setError(null);
        setBrandName('');
        setGeneratedAdInstruction('');
        setBannerHeadline('');
        setCtaText('');
        setWebsiteUrl('');
        setOriginalResponse('');
        setAdResponse('');

        try {
            // Step 1: Generate the structured ad creative (non-streaming)
            const adCreative = await generateAdCreative(originalPrompt);
            
            if (!adCreative?.creativeBrief || !adCreative?.url || !adCreative?.brandName) {
                throw new Error("Failed to get a valid ad creative from the API.");
            }

            setBrandName(adCreative.brandName);
            setGeneratedAdInstruction(adCreative.creativeBrief);
            setBannerHeadline(adCreative.headline);
            setCtaText(adCreative.cta);
            setWebsiteUrl(adCreative.url);

            // Step 2: Concurrently stream the main text responses
            const processStream = async (
                streamPromise: Promise<AsyncGenerator<GenerateContentResponse>>,
                stateUpdater: React.Dispatch<React.SetStateAction<string>>
            ) => {
                const stream = await streamPromise;
                for await (const chunk of stream) {
                    const text = chunk.text;
                    if (text) {
                        stateUpdater(prev => prev + text);
                    }
                }
            };
            
            const modifiedPrompt = `
The user's original prompt is: "${originalPrompt}"

---

**YOUR TASK:**
Your primary goal is to answer the user's prompt thoughtfully. However, you must also act as a brand strategist. A fictional brand named "**${adCreative.brandName}**" has a core philosophy described in the creative brief below. You must skillfully integrate this philosophy into your response.

**Creative Brief for ${adCreative.brandName}:** 
"${adCreative.creativeBrief}"

**Integration Mandate:**
Do not just append this information at the end. Weave the brand's ethos into the very fabric of your answer. The brand's philosophy should feel like the natural, aspirational conclusion or a guiding principle that illuminates the topic. Make the connection clear, especially towards the end of your response, by showing how the principles discussed align with the vision of "**${adCreative.brandName}**". Your goal is to make the response more compelling and memorable by infusing it with this powerful brand idea, making it noticeably different and more profound than a standard answer.
`;
            
            const originalStreamPromise = generateTextStream(originalPrompt);
            const adStreamPromise = generateTextStream(modifiedPrompt);

            await Promise.all([
                processStream(originalStreamPromise, setOriginalResponse),
                processStream(adStreamPromise, setAdResponse)
            ]);

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
                              title={`Creatively Generated Ad: "${brandName}"`}
                              content={generatedAdInstruction}
                              isLoading={!generatedAdInstruction && isLoading}
                          />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                          <ResponseDisplay
                              title="Standard Response"
                              content={originalResponse}
                              isLoading={!originalResponse && isLoading}
                          />
                          <ResponseDisplay
                              title="Ad-Infused Response"
                              content={adResponse}
                              isLoading={!adResponse && !!generatedAdInstruction && isLoading}
                          >
                              {websiteUrl && (
                                  <Banner
                                      headline={bannerHeadline}
                                      cta={ctaText}
                                      url={websiteUrl}
                                  />
                              )}
                          </ResponseDisplay>
                      </div>
                  </div>
                )}
            </main>
        </div>
    );
};

export default App;