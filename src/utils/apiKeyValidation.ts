export const validateOpenAiKey = (key: string): boolean => {
  // Only check if the key starts with 'sk-'
  console.log('Validating key:', key, 'starts with sk-?', key.startsWith('sk-'));
  return key.startsWith('sk-');
};