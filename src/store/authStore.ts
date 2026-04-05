/**
 * Store de autenticación · Zustand
 * Gestiona el estado de sesión del usuario
 */

import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { authService } from '../services/supabase';
import type { UserRole } from '../types';

interface AuthState {
  session: Session | null;
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  error: string | null;

  // Acciones
  inicializar: () => Promise<void>;
  iniciarSesion: (email: string, password: string) => Promise<void>;
  registrarse: (email: string, password: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  resetearPassword: (email: string) => Promise<void>;
  limpiarError: () => void;
}

// Email de Sandra para determinar el rol
const SANDRA_EMAIL = 'sandra@sandramanresa.com';

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  role: null,
  loading: true,
  error: null,

  inicializar: async () => {
    try {
      const { data } = await authService.getSession();
      const session = data.session;
      const user = session?.user ?? null;
      const role: UserRole | null = user
        ? user.email === SANDRA_EMAIL
          ? 'sandra'
          : 'clienta'
        : null;

      set({ session, user, role, loading: false });

      // Escuchar cambios de autenticación
      authService.onAuthStateChange((event, newSession) => {
        const newUser = newSession?.user ?? null;
        const newRole: UserRole | null = newUser
          ? newUser.email === SANDRA_EMAIL
            ? 'sandra'
            : 'clienta'
          : null;

        set({ session: newSession, user: newUser, role: newRole });
      });
    } catch (error) {
      set({ loading: false, error: 'Error iniciando la sesión' });
    }
  },

  iniciarSesion: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await authService.signInWithEmail(email, password);
      if (error) throw error;

      const user = data.user;
      const role: UserRole = user?.email === SANDRA_EMAIL ? 'sandra' : 'clienta';
      set({ session: data.session, user, role, loading: false });
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message === 'Invalid login credentials'
            ? 'Email o contraseña incorrectos'
            : error.message
          : 'Error al iniciar sesión';
      set({ loading: false, error: mensaje });
      throw error;
    }
  },

  registrarse: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await authService.signUpWithEmail(email, password);
      if (error) throw error;

      set({ session: data.session, user: data.user, role: 'clienta', loading: false });
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : 'Error al crear la cuenta';
      set({ loading: false, error: mensaje });
      throw error;
    }
  },

  cerrarSesion: async () => {
    set({ loading: true });
    await authService.signOut();
    set({ session: null, user: null, role: null, loading: false });
  },

  resetearPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const { error } = await authService.resetPassword(email);
      if (error) throw error;
      set({ loading: false });
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : 'Error al resetear la contraseña';
      set({ loading: false, error: mensaje });
      throw error;
    }
  },

  limpiarError: () => set({ error: null }),
}));
