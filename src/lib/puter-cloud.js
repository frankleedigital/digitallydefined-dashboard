// src/lib/puter-cloud.js
// Unified Puter.js cloud OS integration for DigitallyDefined
// Provides authentication, file storage, and cloud persistence across both
// the dashboard and the online-local digital products.

import * as Puter from '@heyputer/puter.js';

let puterInstance = null;
let puterPromise = null;

const DD_WORKSPACE_ROOT = 'digitallydefined';
const DASHBOARD_FOLDER = `${DD_WORKSPACE_ROOT}/dashboard`;
const QUIZ_FOLDER = `${DD_WORKSPACE_ROOT}/quiz`;
const TOOLS_FOLDER = `${DD_WORKSPACE_ROOT}/tools`;
const ROADMAP_FOLDER = `${DD_WORKSPACE_ROOT}/roadmap`;

async function getPuter() {
  if (puterInstance) return puterInstance;
  if (!puterPromise) {
    puterPromise = (async () => {
      const mod = await import('@heyputer/puter.js');
      return mod.default ?? mod;
    })();
  }
  puterInstance = await puterPromise;
  return puterInstance;
}

// --- Authentication ---

export async function isPuterAuthenticated() {
  try {
    const puter = await getPuter();
    const user = await puter.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

export async function getPuterUser() {
  try {
    const puter = await getPuter();
    return await puter.auth.getUser();
  } catch {
    return null;
  }
}

export async function signInWithPuter() {
  const puter = await getPuter();
  await puter.auth.signIn();
  return puter.auth.getUser();
}

export async function signOutFromPuter() {
  const puter = await getPuter();
  await puter.auth.signOut();
}

// --- File Operations ---

async function ensureFolder(puter, folder) {
  try {
    await puter.fs.stat(folder);
  } catch {
    await puter.fs.mkdir(folder, { recursive: true });
  }
  return folder;
}

async function getWorkspaceFolder(folder = DD_WORKSPACE_ROOT) {
  const puter = await getPuter();
  return ensureFolder(puter, folder);
}

export async function writeCloudFile(filename, content, options = {}) {
  const {
    folder = DD_WORKSPACE_ROOT,
    mimeType = 'application/json',
    overwrite = true,
  } = options;

  const puter = await getPuter();
  const workspaceFolder = await getWorkspaceFolder(folder);
  const path = `${workspaceFolder}/${filename}`;

  const file = await puter.fs.write(path, content, { overwrite, mimeType });
  return {
    success: true,
    path: file.path,
    url: file.url,
    id: file.id,
  };
}

export async function readCloudFile(filename, options = {}) {
  const { folder = DD_WORKSPACE_ROOT } = options;

  const puter = await getPuter();
  const workspaceFolder = await getWorkspaceFolder(folder);
  const path = `${workspaceFolder}/${filename}`;

  try {
    const content = await puter.fs.read(path);
    return { success: true, content, path };
  } catch (err) {
    if (err.message?.includes('not found') || err.message?.includes('ENOENT')) {
      return { success: false, error: 'FILE_NOT_FOUND', message: 'File not found' };
    }
    throw err;
  }
}

export async function listCloudFiles(options = {}) {
  const { folder = DD_WORKSPACE_ROOT } = options;

  const puter = await getPuter();
  const workspaceFolder = await getWorkspaceFolder(folder);
  const entries = await puter.fs.readdir(workspaceFolder);

  return {
    success: true,
    files: entries.map((entry) => ({
      name: entry.name,
      path: entry.path,
      type: entry.type,
      size: entry.size,
      modified: entry.modified,
    })),
  };
}

export async function deleteCloudFile(filename, options = {}) {
  const { folder = DD_WORKSPACE_ROOT } = options;

  const puter = await getPuter();
  const workspaceFolder = await getWorkspaceFolder(folder);
  const path = `${workspaceFolder}/${filename}`;

  await puter.fs.delete(path);
  return { success: true, message: `Deleted ${path}` };
}

// --- High-level data persistence for digital products ---

export const CloudStorage = {
  // Quiz results
  async saveQuizResult(result) {
    const filename = `quiz-result-${result.superpower || 'latest'}.json`;
    const content = JSON.stringify({
      ...result,
      syncedAt: new Date().toISOString(),
      version: 2,
    }, null, 2);
    return writeCloudFile(filename, content, { folder: QUIZ_FOLDER });
  },

  async loadQuizResult(superpower = null) {
    if (superpower) {
      return readCloudFile(`quiz-result-${superpower}.json`, { folder: QUIZ_FOLDER });
    }
    // Get latest quiz result
    const listing = await listCloudFiles({ folder: QUIZ_FOLDER });
    if (!listing.success || !listing.files.length) {
      return { success: false, error: 'NO_RESULTS', message: 'No quiz results in cloud' };
    }
    const latest = listing.files
      .filter(f => f.name.startsWith('quiz-result-') && f.name.endsWith('.json'))
      .sort((a, b) => new Date(b.modified) - new Date(a.modified))[0];
    if (!latest) {
      return { success: false, error: 'NO_RESULTS', message: 'No quiz results in cloud' };
    }
    return readCloudFile(latest.name, { folder: QUIZ_FOLDER });
  },

  // Roadmap data
  async saveRoadmap(superpower, roadmapData) {
    const filename = `roadmap-${superpower}.json`;
    const content = JSON.stringify({
      superpower,
      ...roadmapData,
      syncedAt: new Date().toISOString(),
    }, null, 2);
    return writeCloudFile(filename, content, { folder: ROADMAP_FOLDER });
  },

  async loadRoadmap(superpower) {
    return readCloudFile(`roadmap-${superpower}.json`, { folder: ROADMAP_FOLDER });
  },

  // Tool outputs (niche scorecard, trend analysis, social content, product ideas)
  async saveToolOutput(toolName, identifier, data) {
    const filename = `${toolName}-${identifier}.json`;
    const content = JSON.stringify({
      tool: toolName,
      identifier,
      data,
      syncedAt: new Date().toISOString(),
    }, null, 2);
    return writeCloudFile(filename, content, { folder: TOOLS_FOLDER });
  },

  async loadToolOutput(toolName, identifier) {
    return readCloudFile(`${toolName}-${identifier}.json`, { folder: TOOLS_FOLDER });
  },

  async listToolOutputs(toolName = null) {
    const listing = await listCloudFiles({ folder: TOOLS_FOLDER });
    if (!listing.success) return listing;
    let files = listing.files.filter(f => f.name.endsWith('.json'));
    if (toolName) {
      files = files.filter(f => f.name.startsWith(`${toolName}-`));
    }
    return { success: true, files };
  },

  // Dashboard workspace
  async saveWorkspaceFile(filename, content, mimeType = 'text/plain') {
    return writeCloudFile(filename, content, { folder: DASHBOARD_FOLDER, mimeType });
  },

  async loadWorkspaceFile(filename) {
    return readCloudFile(filename, { folder: DASHBOARD_FOLDER });
  },

  async listWorkspaceFiles() {
    return listCloudFiles({ folder: DASHBOARD_FOLDER });
  },
};

// --- React hook for components ---

export function usePuterCloud() {
  // This will be implemented as a proper React hook in a separate file
  // For now, export the functions directly
  return {
    isPuterAuthenticated,
    getPuterUser,
    signInWithPuter,
    signOutFromPuter,
    writeCloudFile,
    readCloudFile,
    listCloudFiles,
    deleteCloudFile,
    CloudStorage,
  };
}

export default {
  getPuter,
  isPuterAuthenticated,
  getPuterUser,
  signInWithPuter,
  signOutFromPuter,
  writeCloudFile,
  readCloudFile,
  listCloudFiles,
  deleteCloudFile,
  CloudStorage,
  usePuterCloud,
};