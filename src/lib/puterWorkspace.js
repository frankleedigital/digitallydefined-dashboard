// src/lib/puterWorkspace.js
// Puter.js workspace manager for the DigitallyDefined Dashboard.
// Works alongside Supabase auth but never requires it — anonymous users get a
// local-generated ID so their cloud saves persist across sessions.

import { getPuter } from "./puter.js";
import { writeFile, readFile, listFiles, deleteFile } from "./storage.js";

const WORKSPACE_FOLDER = "digitallydefined-dashboard";

function deriveUserId() {
  // Prefer Supabase user id when available.
  try {
    const stored = localStorage.getItem("dd_supabase_user_id");
    if (stored) return stored;
  } catch {}
  // Fallback: anonymous persistent ID in sessionStorage (survives refresh).
  let id = sessionStorage.getItem("dd_workspace_uid");
  if (!id) {
    id = "anon-" + Math.random().toString(36).slice(2, 10) + "-" + Date.now().toString(36);
    sessionStorage.setItem("dd_workspace_uid", id);
  }
  return id;
}

async function ensureFolder(puter, userId) {
  const folder = `${WORKSPACE_FOLDER}/${userId}`;
  try {
    await puter.fs.stat(folder);
  } catch {
    await puter.fs.mkdir(folder, { recursive: true });
  }
  return folder;
}

export async function getWorkspaceFolder() {
  const puter = await getPuter();
  const userId = deriveUserId();
  return ensureFolder(puter, userId);
}

export async function saveToWorkspace(filename, content, mimeType = "text/plain") {
  const folder = await getWorkspaceFolder();
  const path = `${folder}/${filename}`;
  return writeFile(path, content, { mimeType });
}

export async function loadFromWorkspace(filename) {
  const folder = await getWorkspaceFolder();
  return readFile(`${folder}/${filename}`);
}

export async function listWorkspaceFiles() {
  const folder = await getWorkspaceFolder();
  return listFiles(folder);
}

export async function deleteFromWorkspace(filename) {
  const folder = await getWorkspaceFolder();
  return deleteFile(`${folder}/${filename}`);
}

export { deriveUserId };
