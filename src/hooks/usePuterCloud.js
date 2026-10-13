// src/hooks/usePuterCloud.js
// React hook for Puter.js cloud OS integration

import { useState, useEffect, useCallback } from 'react';
import {
  isPuterAuthenticated,
  getPuterUser,
  signInWithPuter,
  signOutFromPuter,
  writeCloudFile,
  readCloudFile,
  listCloudFiles,
  deleteCloudFile,
  CloudStorage,
} from '../lib/puter-cloud.js';

export function usePuterCloud() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  const checkAuth = useCallback(async () => {
    try {
      const authenticated = await isPuterAuthenticated();
      if (authenticated) {
        const currentUser = await getPuterUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      console.log('Puter auth check:', err.message);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Sign in with Puter
  const signIn = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const currentUser = await signInWithPuter();
      setUser(currentUser);
      setIsAuthenticated(true);
      return currentUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await signOutFromPuter();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Write file to cloud
  const writeFile = useCallback(async (filename, content, options = {}) => {
    try {
      if (!isAuthenticated) {
        throw new Error('Must be authenticated to write files');
      }
      setError(null);
      return await writeCloudFile(filename, content, options);
    } catch (err) {
      console.error('Puter writeFile error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [isAuthenticated]);

  // Read file from cloud
  const readFile = useCallback(async (filename, options = {}) => {
    try {
      if (!isAuthenticated) {
        throw new Error('Must be authenticated to read files');
      }
      setError(null);
      return await readCloudFile(filename, options);
    } catch (err) {
      console.error('Puter readFile error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [isAuthenticated]);

  // List files in cloud folder
  const listFiles = useCallback(async (options = {}) => {
    try {
      if (!isAuthenticated) {
        throw new Error('Must be authenticated to list files');
      }
      setError(null);
      return await listCloudFiles(options);
    } catch (err) {
      console.error('Puter listFiles error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [isAuthenticated]);

  // Delete file from cloud
  const deleteFile = useCallback(async (filename, options = {}) => {
    try {
      if (!isAuthenticated) {
        throw new Error('Must be authenticated to delete files');
      }
      setError(null);
      return await deleteCloudFile(filename, options);
    } catch (err) {
      console.error('Puter deleteFile error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [isAuthenticated]);

  return {
    // Auth state
    isAuthenticated,
    user,
    isLoading,
    error,
    // Auth actions
    signIn,
    signOut,
    checkAuth,
    // File operations
    writeFile,
    readFile,
    listFiles,
    deleteFile,
    // High-level storage
    CloudStorage,
  };
}

export default usePuterCloud;