import  GroqChat  from 'groq-sdk';

// Initialize the Groq client
export const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not defined in environment variables');
  }
  
  return new GroqChat({
    apiKey,
  });
};

// Define the model to use
export const GROQ_MODEL = 'llama3-70b-8192';
