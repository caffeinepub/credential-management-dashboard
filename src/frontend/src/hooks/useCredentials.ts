import { useState, useEffect, useCallback } from 'react';
import { Credential, CredentialFormData } from '../types/credentials';
import { loadCredentials, saveCredentials } from '../storage/credentialsStorage';

export function useCredentials() {
  const [credentials, setCredentials] = useState<Credential[]>([]);

  useEffect(() => {
    const loaded = loadCredentials();
    setCredentials(loaded);
  }, []);

  useEffect(() => {
    saveCredentials(credentials);
  }, [credentials]);

  const addCredential = useCallback((data: CredentialFormData) => {
    const newCredential: Credential = {
      ...data,
      id: `cred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCredentials(prev => [...prev, newCredential]);
  }, []);

  const updateCredential = useCallback((id: string, data: CredentialFormData) => {
    setCredentials(prev =>
      prev.map(cred =>
        cred.id === id
          ? { ...cred, ...data, updatedAt: Date.now() }
          : cred
      )
    );
  }, []);

  const deleteCredential = useCallback((id: string) => {
    setCredentials(prev => prev.filter(cred => cred.id !== id));
  }, []);

  return {
    credentials,
    addCredential,
    updateCredential,
    deleteCredential,
  };
}
