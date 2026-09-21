// src/lib/auth.js
// Supabase authentication module for DigitallyDefined Dashboard

import { supabase } from '../supabase.js';
import { signIn, signUp, signInWithGoogle as supabaseSignInWithGoogle, signOut as supabaseSignOut } from '../supabase.js';

let currentUser = null;

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    currentUser = user;
    return user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

export async function signInWithEmail(email, password) {
  try {
    const user = await signIn(email, password);
    currentUser = user.user;
    return user;
  } catch (error) {
    console.error('Email sign in failed:', error);
    throw error;
  }
}

export async function signUpWithEmail(email, password, name) {
  try {
    const user = await signUp(email, password, name);
    currentUser = user.user;
    return user;
  } catch (error) {
    console.error('Email sign up failed:', error);
    throw error;
  }
}

export async function signInWithGoogle(nextPath = "/dashboard") {
  try {
    await supabaseSignInWithGoogle(nextPath);
  } catch (error) {
    console.error('Google sign in failed:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    await supabaseSignOut();
    currentUser = null;
  } catch (error) {
    console.error('Sign out failed:', error);
    throw error;
  }
}

export async function isSignedIn() {
  const user = await getCurrentUser();
  return !!user;
}

export { currentUser };
