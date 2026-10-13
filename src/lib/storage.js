// src/lib/storage.js
// Puter.js filesystem storage module — thin wrapper around puter.fs

import { getPuter } from './puter.js';

export async function writeFile(path, content, options = {}) {
  try {
    const puter = await getPuter();
    await puter.fs.writeFile(path, content, options);
    return { success: true };
  } catch (error) {
    console.error('[storage] writeFile failed:', error);
    return { success: false, error: error.message };
  }
}

export async function readFile(path) {
  try {
    const puter = await getPuter();
    const content = await puter.fs.readFile(path);
    return { success: true, data: content };
  } catch (error) {
    console.error('[storage] readFile failed:', error);
    return { success: false, error: error.message, data: null };
  }
}

export async function listFiles(path = '/') {
  try {
    const puter = await getPuter();
    const files = await puter.fs.list(path);
    return { success: true, data: files };
  } catch (error) {
    console.error('[storage] listFiles failed:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function deleteFile(path) {
  try {
    const puter = await getPuter();
    await puter.fs.delete(path);
    return { success: true };
  } catch (error) {
    console.error('[storage] deleteFile failed:', error);
    return { success: false, error: error.message };
  }
}

export async function createDirectory(path) {
  try {
    const puter = await getPuter();
    await puter.fs.mkdir(path, { recursive: true });
    return { success: true };
  } catch (error) {
    console.error('[storage] createDirectory failed:', error);
    return { success: false, error: error.message };
  }
}

