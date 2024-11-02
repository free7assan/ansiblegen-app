import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GenerationOptions, Step, CodeBlock } from '../types';

const genAI = new GoogleGenerativeAI('AIzaSyDIDnlvXjLKiMQyXV4O40pk4qiHc0jSNfM');

interface GenerationResult {
  steps: Step[];
  codeBlocks: CodeBlock[];
}

export async function generateStepsAndCode(
  requirements: string, 
  options: GenerationOptions
): Promise<GenerationResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const complexityLevel = options.codeLevel === 'advanced' 
      ? 'Include advanced features, best practices, and comprehensive error handling'
      : 'Focus on basic functionality and essential features';
    
    const fileStructure = options.multiFile
      ? 'Split the implementation into multiple files (main playbook, roles, variables, etc.)'
      : 'Create a single comprehensive playbook file';

    const prompt = `Given these requirements: "${requirements}"
    
    Create an Ansible playbook with the following specifications:
    - ${complexityLevel}
    - ${fileStructure}
    
    1. First, provide a numbered list of implementation steps (maximum 5 steps).
    2. Then, provide the complete Ansible playbook implementation.
    
    Format your response exactly like this example:
    STEPS:
    1. Set up playbook structure
    2. Define variables and handlers
    3. Implement tasks
    
    CODE:
    ${options.multiFile ? 'filename: site.yml' : 'filename: playbook.yml'}
    \`\`\`yaml
    # Ansible playbook code here
    \`\`\`
    ${options.multiFile ? `
    filename: vars/main.yml
    \`\`\`yaml
    # Variables file
    \`\`\`
    ` : ''}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response
    const stepsMatch = text.match(/STEPS:(.*?)CODE:/s);
    const codeMatch = text.match(/CODE:(.*)/s);
    
    const steps = stepsMatch?.[1]
      .trim()
      .split('\n')
      .filter(step => step.trim())
      .map((step, index) => ({
        id: String(index + 1),
        description: step.replace(/^\d+\.\s*/, '').trim(),
        completed: false
      })) || [];

    const codeBlocks: CodeBlock[] = [];
    if (codeMatch) {
      const codeSection = codeMatch[1].trim();
      const fileBlocks = codeSection.split('filename:');
      
      for (const block of fileBlocks) {
        if (!block.trim()) continue;
        
        const [fileName, ...codeLines] = block.trim().split('\n');
        const code = codeLines
          .join('\n')
          .replace(/^\`\`\`\w*\n/, '')
          .replace(/\`\`\`$/, '')
          .trim();
          
        codeBlocks.push({
          fileName: fileName.trim(),
          language: 'yaml',
          code
        });
      }
    }

    return { steps, codeBlocks };
  } catch (error) {
    console.error('Error generating code:', error);
    throw error;
  }
}