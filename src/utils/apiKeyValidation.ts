export const validateOpenAiKey = (key: string): boolean => {
  return key.startsWith('sk-');
};