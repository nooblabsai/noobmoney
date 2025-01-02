export const validateOpenAiKey = (key: string): boolean => {
  // OpenAI API keys start with 'sk-' and can be of varying length
  return /^sk-[A-Za-z0-9]+$/.test(key);
};