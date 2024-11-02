import React from 'react';
import { Copy, FileCode } from 'lucide-react';
import type { CodeBlock } from '../types';

interface CodeOutputProps {
  codeBlocks: CodeBlock[];
}

export function CodeOutput({ codeBlocks }: CodeOutputProps) {
  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Generated Code</h2>
      {codeBlocks.map((block, index) => (
        <div key={index} className="relative">
          {block.fileName && (
            <div className="flex items-center space-x-2 mb-2 text-sm text-gray-600">
              <FileCode className="h-4 w-4" />
              <span>{block.fileName}</span>
            </div>
          )}
          <div className="relative rounded-lg bg-gray-900 p-4">
            <button
              onClick={() => copyToClipboard(block.code)}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
              title="Copy code"
            >
              <Copy className="h-4 w-4" />
            </button>
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{block.code}</code>
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
}