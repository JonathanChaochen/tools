
export interface DecodedJwt {
  header: Record<string, any> | null;
  payload: Record<string, any> | null;
  signature: string;
  raw: {
    header: string;
    payload: string;
    signature: string;
  };
}

export function base64UrlDecode(str: string): string {
  try {
    // Replace non-url compatible chars
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // Pad with trailing '='s
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw new Error('Illegal base64url string!');
    }
    
    // Decode base64 to string handling UTF-8 characters properly
    return decodeURIComponent(
      atob(output)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch (e) {
    console.warn('Base64 decode error:', e);
    return '';
  }
}

export function decodeJwt(token: string): DecodedJwt | null {
  if (!token) return null;

  // Cleanup: remove 'Bearer ' prefix and trim whitespace
  const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
  const parts = cleanToken.split('.');

  if (parts.length !== 3) {
    return null;
  }

  const [rawHeader, rawPayload, signature] = parts;

  try {
    const headerStr = base64UrlDecode(rawHeader);
    const payloadStr = base64UrlDecode(rawPayload);

    const header = headerStr ? JSON.parse(headerStr) : null;
    const payload = payloadStr ? JSON.parse(payloadStr) : null;

    // Basic validity check - must have at least empty objects
    if (!header || !payload) return null;

    return {
      header,
      payload,
      signature,
      raw: {
        header: rawHeader,
        payload: rawPayload,
        signature
      }
    };
  } catch (e) {
    console.warn('JWT parse error:', e);
    return null;
  }
}
