export const validateOpenAiKey = (key: string): boolean => {
  // Only check if the key starts with 'sk-'
  return key.startsWith('sk-');
};