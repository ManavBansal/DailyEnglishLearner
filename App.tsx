import React, { useState, useEffect, useCallback } from 'react';
import { getDailyLesson } from './services/geminiService';
import { LearningItem } from './types';
import Header from './components/Header';
import LearningCard from './components/LearningCard';
import Loader from './components/Loader';
import ErrorDisplay from './components/ErrorDisplay';
import GenerateButton from './components/GenerateButton';
import ShuffleButton from './components/ShuffleButton';

const App: React.FC = () => {
  const [learningItems, setLearningItems] = useState<LearningItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<number>(1);

  const fetchLesson = useCallback(async (currentLevel: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const lesson = await getDailyLesson(currentLevel);
      setLearningItems(lesson);
    } catch (err) {
      setError('Failed to fetch the lesson. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLesson(level);
  }, [level, fetchLesson]);
  
  const handleNextLevel = () => {
    if (level < 10) {
        setLevel(prevLevel => prevLevel + 1);
    }
  };

  const handleShuffle = () => {
    fetchLesson(level);
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(Number(e.target.value));
  };


  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return <ErrorDisplay message={error} />;
    }
    if (learningItems.length > 0) {
      const words = learningItems.filter(item => item.type === 'word');
      const sentences = learningItems.filter(item => item.type === 'sentence');

      return (
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Words</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {words.map((item, index) => (
                <LearningCard key={`word-${index}`} item={item} fillHeight />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Sentences</h2>
            <div className="space-y-4">
              {sentences.map((item, index) => (
                <LearningCard key={`sentence-${index}`} item={item} />
              ))}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
                <label htmlFor="level-select" className="font-semibold text-slate-700 dark:text-slate-300 text-lg">
                Level:
                </label>
                <select
                id="level-select"
                value={level}
                onChange={handleLevelChange}
                disabled={isLoading}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                >
                {Array.from({ length: 10 }, (_, i) => i + 1).map(l => (
                    <option key={l} value={l}>{l}</option>
                ))}
                </select>
            </div>
            <div className="flex items-center gap-4">
                <ShuffleButton onClick={handleShuffle} isLoading={isLoading} />
                <GenerateButton onClick={handleNextLevel} isLoading={isLoading} />
            </div>
        </div>
        {renderContent()}
      </main>
      <footer className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;