// src/components/ui/PuterCloudSync.jsx
// Cloud sync status and authentication UI component

import React, { useEffect, useState } from 'react';
import { usePuterCloud } from '../../hooks/usePuterCloud.js';
import './PuterCloudSync.css';

export function PuterCloudSync({ variant = 'full', showUserInfo = true }) {
  const { isAuthenticated, user, isLoading, error, signIn, signOut } = usePuterCloud();
  const [syncStatus, setSyncStatus] = useState('idle');
  const [lastSync, setLastSync] = useState(null);

  // Check for last sync time in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('dd-last-cloud-sync');
    if (stored) setLastSync(new Date(stored));
  }, []);

  const handleSignIn = async () => {
    try {
      setSyncStatus('authenticating');
      await signIn();
      setSyncStatus('authenticated');
    } catch (err) {
      setSyncStatus('error');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setSyncStatus('idle');
    } catch (err) {
      setSyncStatus('error');
    }
  };

  const handleSync = async () => {
    setSyncStatus('syncing');
    // This would trigger a full sync of local data to cloud
    // Implementation depends on what data needs syncing
    await new Promise(r => setTimeout(r, 1000)); // Simulate sync
    setSyncStatus('synced');
    const now = new Date();
    setLastSync(now);
    localStorage.setItem('dd-last-cloud-sync', now.toISOString());
    setTimeout(() => setSyncStatus('authenticated'), 2000);
  };

  if (variant === 'badge') {
    return (
      <div className={`puter-sync-badge puter-sync-badge--${isAuthenticated ? 'connected' : 'disconnected'}`}>
        <span className="puter-sync-badge__dot" />
        <span className="puter-sync-badge__text">
          {isLoading ? 'Checking…' : isAuthenticated ? 'Cloud Connected' : 'Cloud Offline'}
        </span>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`puter-sync-minimal puter-sync-minimal--${isAuthenticated ? 'connected' : 'disconnected'}`}>
        {isLoading ? (
          <span className="puter-sync-minimal__spinner" />
        ) : isAuthenticated ? (
          <>
            <span className="puter-sync-minimal__dot" />
            <span className="puter-sync-minimal__text">Cloud</span>
            {showUserInfo && user?.email && (
              <span className="puter-sync-minimal__user">{user.email}</span>
            )}
          </>
        ) : (
          <button className="puter-sync-minimal__btn" onClick={handleSignIn}>
            Connect Cloud
          </button>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`puter-cloud-sync puter-cloud-sync--${isAuthenticated ? 'connected' : 'disconnected'}`}>
      <div className="puter-cloud-sync__header">
        <h3 className="puter-cloud-sync__title">Cloud Sync</h3>
        <span className={`puter-cloud-sync__status puter-cloud-sync__status--${syncStatus}`}>
          {syncStatus === 'idle' && !isAuthenticated && 'Not connected'}
          {syncStatus === 'idle' && isAuthenticated && 'Connected'}
          {syncStatus === 'authenticating' && 'Connecting…'}
          {syncStatus === 'syncing' && 'Syncing…'}
          {syncStatus === 'synced' && 'Synced'}
          {syncStatus === 'authenticated' && 'Authenticated'}
          {syncStatus === 'error' && 'Error'}
        </span>
      </div>

      {error && (
        <div className="puter-cloud-sync__error">
          {error}
        </div>
      )}

      {!isAuthenticated ? (
        <div className="puter-cloud-sync__disconnected">
          <p className="puter-cloud-sync__message">
            Connect your cloud storage to sync quiz results, roadmaps, and tool outputs across devices.
          </p>
          <button
            className="btn btn--primary puter-cloud-sync__btn"
            onClick={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? 'Connecting…' : 'Connect Cloud Storage'}
          </button>
        </div>
      ) : (
        <div className="puter-cloud-sync__connected">
          {showUserInfo && user && (
            <div className="puter-cloud-sync__user">
              <span className="puter-cloud-sync__avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt="" />
                ) : (
                  user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'
                )}
              </span>
              <div className="puter-cloud-sync__user-info">
                <span className="puter-cloud-sync__name">{user.name || 'Puter User'}</span>
                <span className="puter-cloud-sync__email">{user.email}</span>
              </div>
            </div>
          )}

          <div className="puter-cloud-sync__actions">
            <button
              className="btn btn--primary puter-cloud-sync__btn"
              onClick={handleSync}
              disabled={syncStatus === 'syncing'}
            >
              {syncStatus === 'syncing' ? 'Syncing…' : 'Sync Now'}
            </button>
            <button
              className="btn btn--outline puter-cloud-sync__btn"
              onClick={handleSignOut}
            >
              Disconnect
            </button>
          </div>

          {lastSync && (
            <div className="puter-cloud-sync__last-sync">
              Last synced: {lastSync.toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PuterCloudSync;