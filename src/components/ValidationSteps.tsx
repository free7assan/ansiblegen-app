import React from 'react';
import { Cog } from 'lucide-react';
import type { Step } from '../types';
import { StepsList } from './StepsList';

interface ValidationStepsProps {
  steps: Step[];
  onUpdateSteps: (steps: Step[]) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function ValidationSteps({ steps, onUpdateSteps, onConfirm, isLoading }: ValidationStepsProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Review Installation and Configuration Steps</h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Review and customize these steps before generating the Ansible playbook. You can reorder, edit, or remove steps as needed.
        </p>
      </div>

      <StepsList steps={steps} onUpdateSteps={onUpdateSteps} />

      <div className="flex justify-end pt-4">
        <button
          onClick={onConfirm}
          disabled={steps.length === 0 || isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <>
              <Cog className="h-4 w-4 mr-2" />
              Generate Playbook
            </>
          )}
        </button>
      </div>
    </div>
  );
}