import { Expert } from '@/types';

export const validateExpertForm = (form: any): boolean => {
  return !!(form.name?.trim() && form.quote?.trim());
};

export const generateExpertContext = (experts: Expert[]): string => {
  return experts.map((expert: Expert) => {
    const title = expert.title ? ` (${expert.title})` : '';
    const expertise = expert.expertise ? ` - ${expert.expertise}` : '';
    const context = expert.context ? ` Context: ${expert.context}` : '';
    return `${expert.name}${title}${expertise}: "${expert.quote}"${context}`;
  }).join('\n\n');
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};