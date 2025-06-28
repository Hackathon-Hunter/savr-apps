import OpenAI from 'openai';

const OPENAI_API_KEY = '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';

if (!OPENAI_API_KEY) {
  console.warn('NEXT_PUBLIC_OPENAI_API_KEY is not set in environment variables');
}

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Required for client-side usage
});

// Check if OpenAI is available
export const isOpenAIAvailable = (): boolean => {
  return !!OPENAI_API_KEY;
};

export default openai;