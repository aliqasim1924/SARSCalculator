// Session storage utilities with fallbacks
interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

class CookieStorage implements StorageAdapter {
  getItem(key: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const name = key + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }

  setItem(key: string, value: string): void {
    if (typeof document === 'undefined') return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
    
    // Only use secure flag in production (HTTPS)
    const isSecure = window.location.protocol === 'https:';
    const secureFlag = isSecure ? ';secure' : '';
    
    document.cookie = `${key}=${value};expires=${expires.toUTCString()};path=/${secureFlag};samesite=lax`;
  }

  removeItem(key: string): void {
    if (typeof document === 'undefined') return;
    
    document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
}

class HybridStorage implements StorageAdapter {
  private localStorage: Storage | null = null;
  private cookieStorage: CookieStorage;

  constructor() {
    this.cookieStorage = new CookieStorage();
    
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        // Test localStorage availability
        const testKey = '__storage_test__';
        window.localStorage.setItem(testKey, 'test');
        window.localStorage.removeItem(testKey);
        this.localStorage = window.localStorage;
      } catch (error) {
        console.warn('localStorage not available, falling back to cookies:', error);
      }
    }
  }

  getItem(key: string): string | null {
    try {
      let value = null;
      if (this.localStorage) {
        value = this.localStorage.getItem(key);
      }
      if (!value) {
        value = this.cookieStorage.getItem(key);
      }
      return value;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      if (this.localStorage) {
        this.localStorage.setItem(key, value);
        // Also backup to cookies as fallback
        this.cookieStorage.setItem(key, value);
      } else {
        this.cookieStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Storage setItem error:', error);
      // Try cookie fallback if localStorage fails
      try {
        this.cookieStorage.setItem(key, value);
      } catch (cookieError) {
        console.error('Cookie storage also failed:', cookieError);
      }
    }
  }

  removeItem(key: string): void {
    try {
      if (this.localStorage) {
        this.localStorage.removeItem(key);
      }
      this.cookieStorage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  }
}

// Create a singleton instance
export const storage = new HybridStorage();

// Utility functions for common operations
export const setAuthSession = (sessionData: any) => {
  try {
    storage.setItem('sars-calculator-auth', JSON.stringify(sessionData));
  } catch (error) {
    console.error('Failed to save auth session:', error);
  }
};

export const getAuthSession = () => {
  try {
    const sessionData = storage.getItem('sars-calculator-auth');
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    console.error('Failed to get auth session:', error);
    return null;
  }
};

export const clearAuthSession = () => {
  try {
    storage.removeItem('sars-calculator-auth');
  } catch (error) {
    console.error('Failed to clear auth session:', error);
  }
}; 