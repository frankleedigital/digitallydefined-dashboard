// Puter.js Frontend Integration for DigitallyDefined Dashboard
// Add this to your DashboardPage.jsx or create a new Puter.js client module

import { useState, useEffect } from 'react';

// Puter.js client configuration
const PUTER_CONFIG = {
  appId: 'digitallydefined',
  origin: window.location.origin,
};

// Initialize Puter.js
async function initPuter() {
  if (typeof puter === 'undefined') {
    // Load Puter.js from CDN
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.puter.com/v2/';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  // Initialize Puter.js
  puter.ui.onLoad();
  await puter.auth.signIn();
  
  return {
    fs: puter.fs,
    ui: puter.ui,
    auth: puter.auth,
    kv: puter.kv,
    apps: puter.apps,
    memory: puter.memory
  };
}

// Puter.js Workspace Manager
class PuterWorkspaceClient {
  constructor(userId) {
    this.userId = userId;
    this.workspaceId = `digitallydefined-${userId}`;
    this.root = `/users/${userId}/digitallydefined`;
    this.puter = null;
  }

  async initialize() {
    this.puter = await initPuter();
    await this.ensureWorkspace();
    return this;
  }

  async ensureWorkspace() {
    try {
      await this.puter.fs.stat(this.root);
    } catch {
      await this.puter.fs.mkdir(this.root, { recursive: true });
    }
  }

  // File operations
  async writeFile(path, content) {
    const fullPath = `${this.root}/${path}`;
    return await this.puter.fs.write(fullPath, content);
  }

  async readFile(path) {
    const fullPath = `${this.root}/${path}`;
    try {
      return await this.puter.fs.read(fullPath);
    } catch {
      return null;
    }
  }

  async listFiles(path = '') {
    const fullPath = `${this.root}/${path}`;
    try {
      return await this.puter.fs.readdir(fullPath);
    } catch {
      return [];
    }
  }

  async deleteFile(path) {
    const fullPath = `${this.root}/${path}`;
    return await this.puter.fs.delete(fullPath);
  }

  // Storage operations
  async setItem(key, value) {
    return await this.puter.kv.set(`${this.userId}/${key}`, JSON.stringify(value));
  }

  async getItem(key) {
    const raw = await this.puter.kv.get(`${this.userId}/${key}`);
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  async deleteItem(key) {
    return await this.puter.kv.delete(`${this.userId}/${key}`);
  }

  // Memory operations
  async saveMemory(key, value) {
    return await this.setItem(`memory/${key}`, value);
  }

  async getMemory(key) {
    return await this.getItem(`memory/${key}`);
  }

  async saveTask(task) {
    const tasks = await this.getItem('tasks') || [];
    tasks.push({
      ...task,
      id: `task-${Date.now()}`,
      created: new Date().toISOString(),
      status: 'pending'
    });
    return await this.setItem('tasks', tasks);
  }

  async getTasks() {
    return await this.getItem('tasks') || [];
  }

  async completeTask(taskId) {
    const tasks = await this.getTasks();
    const updated = tasks.map(t => 
      t.id === taskId ? { ...t, status: 'completed', completed: new Date().toISOString() } : t
    );
    return await this.setItem('tasks', updated);
  }
}

// React Hook for Puter.js Integration
export function usePuter() {
  const [workspace, setWorkspace] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initialize() {
      try {
        const puter = await initPuter();
        const currentUser = puter.auth.currentUser();
        setUser(currentUser);
        
        const ws = new PuterWorkspaceClient(currentUser.id);
        await ws.initialize();
        setWorkspace(ws);
        setIsInitialized(true);
      } catch (e) {
        setError(e.message);
      }
    }
    
    initialize();
  }, []);

  return { workspace, isInitialized, user, error };
}

// Puter.js UI Components
export function PuterFileSystem({ workspace, path = '' }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadFiles() {
      setLoading(true);
      const result = await workspace.listFiles(path);
      setFiles(result);
      setLoading(false);
    }
    loadFiles();
  }, [workspace, path]);

  if (loading) return <div>Loading files...</div>;

  return (
    <div className="puter-file-system">
      <h3>Workspace: {workspace.root}/{path || ''}</h3>
      <ul>
        {files.map((file, i) => (
          <li key={i}>{file}</li>
        ))}
      </ul>
    </div>
  );
}

export function PuterTaskManager({ workspace }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    async function loadTasks() {
      const result = await workspace.getTasks();
      setTasks(result);
    }
    loadTasks();
  }, [workspace]);

  const addTask = async () => {
    if (!newTask.trim()) return;
    await workspace.saveTask({ title: newTask });
    setNewTask('');
    const result = await workspace.getTasks();
    setTasks(result);
  };

  const completeTask = async (taskId) => {
    await workspace.completeTask(taskId);
    const result = await workspace.getTasks();
    setTasks(result);
  };

  return (
    <div className="puter-task-manager">
      <h3>Tasks</h3>
      <div className="task-input">
        <input 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task..."
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className={task.status}>
            <span>{task.title}</span>
            {task.status === 'pending' && (
              <button onClick={() => completeTask(task.id)}>Complete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PuterWorkspaceClient;
