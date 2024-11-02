import React, { useState } from 'react';
import { Header } from './components/Header';
import { RequirementInput } from './components/RequirementInput';
import { StepsList } from './components/StepsList';
import { CodeOutput } from './components/CodeOutput';
import { ValidationSteps } from './components/ValidationSteps';
import { generateStepsAndCode } from './services/gemini';
import type { Step, CodeBlock, GenerationOptions } from './types';

function App() {
  const [requirements, setRequirements] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [validationSteps, setValidationSteps] = useState<Step[]>([]);
  const [options, setOptions] = useState<GenerationOptions>({
    codeLevel: 'basic',
    multiFile: false,
  });

  const handleValidate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generateStepsAndCode(requirements, options);
      setValidationSteps(result.steps);
      setShowValidation(true);
    } catch (err) {
      setError('Failed to generate validation steps. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generateStepsAndCode(requirements, options);
      setSteps(result.steps);
      setCodeBlocks(result.codeBlocks);
      setShowValidation(false);
    } catch (err) {
      setError('Failed to generate code. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSteps = (newSteps: Step[]) => {
    setSteps(newSteps);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-8">
          <RequirementInput
            value={requirements}
            onChange={setRequirements}
            onValidate={handleValidate}
            onSubmit={handleGenerate}
            isLoading={isLoading}
            showValidation={showValidation}
            options={options}
            onOptionsChange={setOptions}
          />
          
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          )}
          
          {showValidation && validationSteps.length > 0 && (
            <ValidationSteps
              steps={validationSteps}
              onUpdateSteps={setValidationSteps}
              onConfirm={handleGenerate}
              isLoading={isLoading}
            />
          )}
          
          {!showValidation && steps.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <StepsList 
                steps={steps} 
                onUpdateSteps={updateSteps}
              />
              <CodeOutput codeBlocks={codeBlocks} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;