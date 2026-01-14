/**
 * Encodes a string to Base64 with UTF-8 support.
 * Handles non-ASCII characters (e.g., emojis, Chinese) correctly.
 */
export function encodeBase64(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (byte) =>
      String.fromCodePoint(byte)
    ).join("");
    return btoa(binString);
  } catch {
    throw new Error("Failed to encode text.");
  }
}

/**
 * Decodes a Base64 string to plain text with UTF-8 support.
 */
export function decodeBase64(base64: string): string {
  try {
    const binString = atob(base64);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
    return new TextDecoder().decode(bytes);
  } catch {
    throw new Error("Invalid Base64 string.");
  }
}
