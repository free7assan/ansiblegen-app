import React from 'react';
import { ListChecks, FileCode, Settings2, Cog } from 'lucide-react';
import type { CodeLevel, GenerationOptions } from '../types';

interface RequirementInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  showValidation: boolean;
  options: GenerationOptions;
  onOptionsChange: (options: GenerationOptions) => void;
}

export function RequirementInput({
  value,
  onChange,
  onValidate,
  onSubmit,
  isLoading,
  showValidation,
  options,
  onOptionsChange,
}: RequirementInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && value.trim() && !isLoading) {
      showValidation ? onSubmit() : onValidate();
    }
  };

  const handleCodeLevelChange = (level: CodeLevel) => {
    onOptionsChange({ ...options, codeLevel: level });
  };

  const handleMultiFileChange = (multiFile: boolean) => {
    onOptionsChange({ ...options, multiFile });
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="requirements" className="block text-base font-medium text-gray-900">
          Describe your Ansible playbook requirements
        </label>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Settings2 className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">Complexity:</span>
            <div className="flex rounded-md shadow-sm" role="group">
              {(['basic', 'advanced'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => handleCodeLevelChange(level)}
                  className={`px-3 py-1 text-sm font-medium ${
                    options.codeLevel === level
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } ${level === 'basic' ? 'rounded-l-md' : 'rounded-r-md'} border border-gray-200`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FileCode className="h-4 w-4 text-gray-500" />
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={options.multiFile}
                onChange={(e) => handleMultiFileChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ms-2 text-sm font-medium text-gray-700">Split into multiple files</span>
            </label>
          </div>
        </div>
      </div>
      <div className="relative">
        <textarea
          id="requirements"
          rows={4}
          className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none ring-indigo-500 focus:border-indigo-500 focus:ring-1"
          placeholder="Example: Create an Ansible playbook to install and configure Nginx with SSL certificates..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={showValidation ? onSubmit : onValidate}
          disabled={isLoading || !value.trim()}
          className="absolute bottom-3 right-3 inline-flex items-center rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : showValidation ? (
            <>
              <Cog className="h-4 w-4 mr-2" />
              Generate Playbook
            </>
          ) : (
            <>
              <ListChecks className="h-4 w-4 mr-2" />
              Generate Steps
            </>
          )}
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Press {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter to {showValidation ? 'generate playbook' : 'generate steps'}
      </p>
    </div>
  );
}