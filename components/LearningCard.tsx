
import React from 'react';
import { LearningItem } from '../types';

interface LearningCardProps {
  item: LearningItem;
  fillHeight?: boolean;
}

const SpeakerIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
  </svg>
);


const LearningCard: React.FC<LearningCardProps> = ({ item, fillHeight = false }) => {
  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(item.english);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Your browser does not support text-to-speech.');
    }
  };

  const baseClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300";
  const layoutClasses = fillHeight ? "flex flex-col justify-between h-full" : "";
  const finalClasses = [baseClasses, layoutClasses].filter(Boolean).join(' ');

  return (
    <div className={finalClasses}>
      <div>
        <div className="flex items-center justify-between gap-4 mb-3">
          <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">{item.english}</p>
          <button
            type="button"
            onClick={handleSpeak}
            aria-label={`Read "${item.english}" aloud`}
            className="flex-shrink-0 p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500"
          >
            <SpeakerIcon />
          </button>
        </div>
        <p className="text-lg font-medium text-blue-600 dark:text-blue-400" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>{item.hindi}</p>
      </div>
    </div>
  );
};

export default LearningCard;
