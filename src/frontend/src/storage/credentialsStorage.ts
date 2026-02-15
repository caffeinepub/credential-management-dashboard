import { Credential } from '../types/credentials';

const STORAGE_KEY = 'credential_management_data';

export function loadCredentials(): Credential[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    
    return parsed.filter((item: any) => 
      item && 
      typeof item === 'object' && 
      typeof item.id === 'string' &&
      typeof item.loginId === 'string'
    );
  } catch (error) {
    console.error('Failed to load credentials:', error);
    return [];
  }
}

export function saveCredentials(credentials: Credential[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
  } catch (error) {
    console.error('Failed to save credentials:', error);
  }
}
