import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AuthenticatedUser } from '../types/authentication-types';

type CurrentUserState = {
  currentUser: AuthenticatedUser | null;
  actions: CredentialActions;
};

type CredentialActions = {
  setCurrentUser: (user: AuthenticatedUser | null) => void;
  clearCredentials: () => void;
};

const useCredentialStore = create<CurrentUserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      actions: {
        setCurrentUser: (authenticatedUser: AuthenticatedUser | null) => {
          set({
            currentUser: authenticatedUser,
          });
        },
        clearCredentials: () => {
          set({
            currentUser: null,
          });
        },
      },
    }),
    {
      name: 'current-user',
      partialize: state => ({
        currentUser: state.currentUser,
      }),
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useCurrentUser = () => useCredentialStore(state => state.currentUser);
export const useCredentialActions = () => useCredentialStore(state => state.actions);
