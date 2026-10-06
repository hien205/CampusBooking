import { create } from 'zustand';

import {
  onAuthStateChanged,
  User,
} from 'firebase/auth';

import { auth } from '../config/firebase';


type AuthState = {
  user: User | null;

  initialized: boolean;

  initializeAuth: () => () => void;

  setUser: (
    user: User | null
  ) => void;

  logout: () => Promise<void>;
};


export const useAuthStore =
  create<AuthState>((set) => ({
    user: null,

    initialized: false,

    setUser: (user) =>
      set({
        user,
      }),

    initializeAuth: () => {
      const unsubscribe =
        onAuthStateChanged(
          auth,
          (user) => {
            set({
              user,
              initialized: true,
            });
          }
        );

      return unsubscribe;
    },

    logout: async () => {
      await auth.signOut();

      set({
        user: null,
      });
    },
  }));