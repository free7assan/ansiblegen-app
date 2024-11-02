import React from 'react';
import { Code2, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <Code2 className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Code Generation Assistant</h1>
          <Sparkles className="h-5 w-5 text-yellow-300" />
        </div>
        <p className="mt-2 text-indigo-200">Powered by Gemini AI</p>
      </div>
    </header>
  );
}