export interface Step {
  id: string;
  description: string;
  completed: boolean;
}

export interface CodeBlock {
  language: string;
  code: string;
  fileName?: string;
}

export type CodeLevel = 'basic' | 'advanced';

export interface GenerationOptions {
  codeLevel: CodeLevel;
  multiFile: boolean;
}