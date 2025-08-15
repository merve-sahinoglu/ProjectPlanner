import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AuthenticatedUser } from '../types/authentication-types';

type CurrentUserState = {
  currentUser: AuthenticatedUser | null;
  actions: CredentialActions;
  currentUserFunctions: string[];
};

type CredentialActions = {
  setCurrentUser: (user: AuthenticatedUser | null) => void;
  clearCredentials: () => void;
  checkIfUserHasFunctionAuthorization: (functionCode: string) => boolean;
  setCurrentUserFunctions: (userFunctionList: string[]) => void;
};

const useCredentialStore = create<CurrentUserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      currentUserFunctions: [],
      actions: {
        setCurrentUser: (authenticatedUser: AuthenticatedUser | null) => {
          set({
            currentUser: authenticatedUser,
          });
        },
        clearCredentials: () => {
          set({
            currentUser: null,
            currentUserFunctions: [],
          });
        },
        setCurrentUserFunctions: (userFunctionList: string[]) => {
          set({
            currentUserFunctions: userFunctionList,
          });
        },
        checkIfUserHasFunctionAuthorization: (functionCode: string) => {
          const userFunctions = get().currentUserFunctions;
debugger;
          if (userFunctions.find((x) => x === functionCode)) {
            return true;
          }

          return false;
        },
      },
    }),
    {
      name: "current-user",
      partialize: (state) => ({
        currentUser: state.currentUser,
      }),
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useCurrentUser = () => useCredentialStore(state => state.currentUser);
export const useCredentialActions = () => useCredentialStore(state => state.actions);
