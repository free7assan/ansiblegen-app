import React, { useState } from 'react';
import { GripVertical, X, Plus, Edit2 } from 'lucide-react';
import type { Step } from '../types';

interface StepsListProps {
  steps: Step[];
  onUpdateSteps: (steps: Step[]) => void;
}

export function StepsList({ steps, onUpdateSteps }: StepsListProps) {
  const [draggedStep, setDraggedStep] = useState<string | null>(null);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [newStep, setNewStep] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleDragStart = (id: string) => {
    setDraggedStep(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedStep || draggedStep === targetId) return;

    const draggedIndex = steps.findIndex(step => step.id === draggedStep);
    const targetIndex = steps.findIndex(step => step.id === targetId);
    
    const newSteps = [...steps];
    const [draggedItem] = newSteps.splice(draggedIndex, 1);
    newSteps.splice(targetIndex, 0, draggedItem);
    
    onUpdateSteps(newSteps);
  };

  const handleDelete = (id: string) => {
    onUpdateSteps(steps.filter(step => step.id !== id));
  };

  const startEditing = (step: Step) => {
    setEditingStep(step.id);
    setEditedContent(step.description);
  };

  const saveEdit = () => {
    if (!editingStep || !editedContent.trim()) return;
    
    onUpdateSteps(steps.map(step => 
      step.id === editingStep 
        ? { ...step, description: editedContent.trim() }
        : step
    ));
    
    setEditingStep(null);
    setEditedContent('');
  };

  const handleAddStep = () => {
    if (!newStep.trim()) return;
    
    const newStepObj: Step = {
      id: `step-${Date.now()}`,
      description: newStep,
      completed: false
    };
    
    onUpdateSteps([...steps, newStepObj]);
    setNewStep('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Installation and Configuration Steps</h2>
      <div className="space-y-2">
        {steps.map((step) => (
          <div
            key={step.id}
            draggable
            onDragStart={() => handleDragStart(step.id)}
            onDragOver={(e) => handleDragOver(e, step.id)}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 group"
          >
            <div className="cursor-move text-gray-400 hover:text-gray-600">
              <GripVertical className="h-5 w-5" />
            </div>
            <div className="flex-1">
              {editingStep === step.id ? (
                <input
                  type="text"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                  onBlur={saveEdit}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                  autoFocus
                />
              ) : (
                <span className="text-gray-700">{step.description}</span>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => startEditing(step)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-indigo-600 transition-opacity"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(step.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {isAdding ? (
        <div className="mt-4">
          <input
            type="text"
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
            placeholder="Enter new installation or configuration step..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            autoFocus
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddStep}
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Step
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-4 flex items-center text-sm text-indigo-600 hover:text-indigo-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Step
        </button>
      )}
    </div>
  );
}