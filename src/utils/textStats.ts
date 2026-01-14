/**
 * Calculate text statistics
 */
export const getTextStats = (text: string) => {
  const characters = text.length;
  const lines = text ? text.split('\n').length : 0;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return { characters, lines, words };
};

/**
 * Format number with commas for readability
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};
