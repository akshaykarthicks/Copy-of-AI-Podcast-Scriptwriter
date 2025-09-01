
import React from 'react';

interface TopicInputProps {
  topic: string;
  setTopic: (topic: string) => void;
  hostName: string;
  setHostName: (hostName: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const TopicInput: React.FC<TopicInputProps> = ({ topic, setTopic, hostName, setHostName, onSubmit, isLoading }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <div 
      id="topic-input-container" 
      className="bg-white p-6 rounded-xl shadow-[4px_4px_0px_#DB2777,8px_8px_0px_#BE185D] border-2 border-[#BE185D]"
    >
      <div className="mb-4">
        <label htmlFor="host-name-input" className="block mb-2 text-lg font-bold text-[#A855F7]">
          Host Name
        </label>
        <input
          type="text"
          id="host-name-input"
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
          placeholder="e.g., Alex"
          className="w-full p-4 bg-white border-2 border-[#D1D5DB] rounded-lg text-[#4A4A4A] focus:ring-4 focus:ring-[#A855F7] focus:border-[#A855F7] focus:outline-none transition-all placeholder:text-[#D1D5DB]"
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="topic-input" className="block mb-2 text-lg font-bold text-[#A855F7]">
          Podcast Topic
        </label>
        <textarea
          id="topic-input"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., The Future of Artificial Intelligence"
          className="w-full h-28 p-4 bg-white border-2 border-[#D1D5DB] rounded-lg text-[#4A4A4A] focus:ring-4 focus:ring-[#A855F7] focus:border-[#A855F7] focus:outline-none resize-none transition-all placeholder:text-[#D1D5DB]"
          disabled={isLoading}
        />
      </div>
      <button
        onClick={onSubmit}
        disabled={isLoading || !topic.trim() || !hostName.trim()}
        className="mt-4 w-full flex justify-center items-center bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold py-3 px-4 rounded-lg border-2 border-[#6B21A8] shadow-[3px_3px_0_#BE185D] hover:shadow-[4px_4px_0_#BE185D] active:shadow-[1px_1px_0_#BE185D] active:translate-x-px active:translate-y-px disabled:bg-purple-300 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-150"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Script'
        )}
      </button>
    </div>
  );
};

export default TopicInput;
