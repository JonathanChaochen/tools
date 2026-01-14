/**
 * Parses a date string or timestamp into a Date object.
 * Supports:
 * - Unix Seconds (e.g. 1705220000)
 * - Unix Milliseconds (e.g. 1705220000000)
 * - ISO 8601 strings (e.g. 2024-01-14T09:30:00Z)
 */
export const parseDateInput = (input: string): Date | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Try numeric input first
  if (/^\-?\d+(\.\d+)?$/.test(trimmed)) {
    const num = parseFloat(trimmed);
    
    // Guess if it's seconds or milliseconds
    // Threshold: Year 2001 in ms is around 1e12 (13 digits)
    // 1e11 is around year 1973 in ms, or year 5138 in seconds
    // Let's use a heuristic: if absolute value is < 1e11 (100 Billion), treat as seconds.
    // This covers typical usage for current dates.
    // 1705220000 (seconds) -> ~1.7e9
    // 1705220000000 (ms) -> ~1.7e12
    
    if (Math.abs(num) < 1e11) {
      // Treat as seconds
      return new Date(num * 1000);
    } else {
      // Treat as milliseconds
      return new Date(num);
    }
  }

  // Try standard Date parsing for strings (ISO 8601, etc.)
  const date = new Date(trimmed);
  if (!isNaN(date.getTime())) {
    return date;
  }

  return null;
};

// --- Formatters ---

export const getUnixSeconds = (date: Date): string => {
  return Math.floor(date.getTime() / 1000).toString();
};

export const getUnixMillis = (date: Date): string => {
  return date.getTime().toString();
};

export const getISOString = (date: Date): string => {
  return date.toISOString();
};

export const getLocalString = (date: Date): string => {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(date);
};

export const getUTCString = (date: Date): string => {
  return date.toUTCString();
};
