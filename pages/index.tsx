import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import TopicInput from '../components/TopicInput';
import ScriptDisplay from '../components/ScriptDisplay';
import LoadingSpinner from '../components/LoadingSpinner';

const Home: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [hostName, setHostName] = useState<string>('');
  const [script, setScript] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateScript = useCallback(async () => {
    if (!topic.trim() || !hostName.trim()) {
      setError('Please enter both a podcast topic and a host name.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setScript('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, hostName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await response.json();
      setScript(data.script);
    } catch (err: any) {
      console.error('Error generating script:', err);
      setError(`Failed to generate script. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [topic, hostName]);

  return (
    <>
      <Head>
        <title>AI Podcast Scriptwriter</title>
        <meta name="description" content="An AI-powered tool that transforms your podcast topics into comprehensive, engaging, and well-structured scripts." />
        <link rel="icon" href="/vite.svg" />
      </Head>
      <div className="font-balsamiq min-h-screen bg-gradient-to-b from-[#FCE7F3] to-[#FBCFE8] text-[#4A4A4A] flex flex-col items-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl mx-auto flex-grow">
          <header id="app-header" className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-[#BE185D] drop-shadow-[2px_2px_0_rgba(255,255,255,0.5)]">
                  AI Podcast Scriptwriter
              </h1>
              <p className="text-[#6B21A8] mt-2 text-lg">
                  Transform your ideas into engaging podcast episodes instantly.
              </p>
          </header>

          <main className="w-full">
            <TopicInput
              topic={topic}
              setTopic={setTopic}
              hostName={hostName}
              setHostName={setHostName}
              onSubmit={handleGenerateScript}
              isLoading={isLoading}
            />
            
            <div className="mt-8">
              {isLoading && <LoadingSpinner />}
              {error && (
                <div className="bg-red-100 border-2 border-[#BE185D] text-red-700 px-4 py-3 rounded-lg text-center font-semibold">
                  <p>{error}</p>
                </div>
              )}
              {script && !isLoading && <ScriptDisplay script={script} />}
            </div>
          </main>
        </div>
        <footer className="w-full text-center py-4 mt-8">
          <p className="text-[#6B21A8]">
            Made with ♡ by <a href="https://github.com/akshaykarthicks" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">Akshay Karthick</a>
          </p>
        </footer>
      </div>
    </>
  );
};

export default Home;