// src/lib/puterWorkspace.js
// Puter.js workspace manager for the DigitallyDefined Dashboard.
// Uses the new puter-cloud.js library for robust cloud storage.

import { CloudStorage, isPuterAuthenticated } from "./puter-cloud.js";

const DASHBOARD_FOLDER = 'digitallydefined/dashboard';

export async function getWorkspaceFolder() {
  const puter = await import('./puter.js').then(m => m.getPuter());
  return DASHBOARD_FOLDER;
}

export async function saveToWorkspace(filename, content, mimeType = "text/plain") {
  const isAuth = await isPuterAuthenticated();
  if (!isAuth) {
    return { success: false, error: 'NOT_AUTHENTICATED', message: 'Please connect your cloud storage first' };
  }
  return CloudStorage.saveWorkspaceFile(filename, content, mimeType);
}

export async function loadFromWorkspace(filename) {
  const isAuth = await isPuterAuthenticated();
  if (!isAuth) {
    return { success: false, error: 'NOT_AUTHENTICATED', message: 'Please connect your cloud storage first' };
  }
  return CloudStorage.loadWorkspaceFile(filename);
}

export async function listWorkspaceFiles() {
  const isAuth = await isPuterAuthenticated();
  if (!isAuth) {
    return { success: false, error: 'NOT_AUTHENTICATED', message: 'Please connect your cloud storage first' };
  }
  return CloudStorage.listWorkspaceFiles();
}

export async function deleteFromWorkspace(filename) {
  const isAuth = await isPuterAuthenticated();
  if (!isAuth) {
    return { success: false, error: 'NOT_AUTHENTICATED', message: 'Please connect your cloud storage first' };
  }
  return CloudStorage.deleteCloudFile(filename, { folder: DASHBOARD_FOLDER });
}

export { isPuterAuthenticated };