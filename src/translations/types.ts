import { enTranslations } from './en';

export type TranslationKey = keyof typeof enTranslations | `category.${string}`;
export type Language = 'en' | 'el';
export type Translations = Record<Language, typeof enTranslations>;