import { useState } from 'react';

export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      return false;
    }
  };

  const paste = async (): Promise<string | null> => {
    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (error) {
      console.error('Failed to paste:', error);
      return null;
    }
  };

  return { copy, paste, copied };
};
