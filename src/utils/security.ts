// Security utility functions

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 10000); // Limit length
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 320; // RFC 5321 limit
}

/**
 * Validate URL to prevent open redirects
 */
export function isValidRedirectUrl(url: string, allowedDomains: string[] = []): boolean {
  try {
    const urlObj = new URL(url);
    
    // Allow relative URLs
    if (url.startsWith('/') && !url.startsWith('//')) {
      return true;
    }
    
    // Check if domain is in allowed list
    if (allowedDomains.length > 0) {
      return allowedDomains.some(domain => 
        urlObj.hostname === domain || 
        urlObj.hostname.endsWith('.' + domain)
      );
    }
    
    // By default, only allow same origin
    return urlObj.origin === window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) return false;
  
  // Use constant-time comparison to prevent timing attacks
  if (token.length !== expectedToken.length) return false;
  
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Secure data storage utility
 */
export const secureStorage = {
  setItem(key: string, value: string, temporary = false): void {
    const storage = temporary ? sessionStorage : localStorage;
    try {
      storage.setItem(key, value);
    } catch (error) {
      console.warn('Failed to store item:', error);
    }
  },

  getItem(key: string, temporary = false): string | null {
    const storage = temporary ? sessionStorage : localStorage;
    try {
      return storage.getItem(key);
    } catch (error) {
      console.warn('Failed to retrieve item:', error);
      return null;
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove item:', error);
    }
  },

  clear(): void {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  }
};