
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-5 max-w-5xl">
        <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">
          Daily English Learner
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-300 mt-1">
          Your daily dose of English and Hindi words & sentences.
        </p>
      </div>
    </header>
  );
};

export default Header;
