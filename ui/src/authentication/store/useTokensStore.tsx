import { jwtDecode } from 'jwt-decode';
import { Token, TokenData, TokenDataSchema } from '../types/authentication-types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthActions = {
  setAccessToken: (accessToken: string) => void;
  getAccessToken: () => Token | undefined;
  clearTokens: () => void;
  validateAccessTokenExpiry: () => void;
  calculateTokenExpiryTime: () => number;
};

type AuthState = {
  accessToken: Token | undefined;
  accessTokenData: TokenData | undefined;
  actions: AuthActions;
};

export const decodeAccessToken = (accessToken: string) =>
  TokenDataSchema.parse(jwtDecode<TokenData>(accessToken));

const accessTokenExpiryTime = 900000; // TODO: 28000000 5 Hours - 900000 15 Minute

const useTokenStore = create<AuthState>()(
  persist(
    (set, get, rehydrate) => ({
      accessToken: undefined,
      accessTokenData: undefined,
      actions: {
        setAccessToken: (accessToken: string) => {
          set({
            accessToken: {
              value: accessToken,
              expiry: new Date().getTime() + accessTokenExpiryTime,
              expired: false,
            },
            accessTokenData: decodeAccessToken(accessToken),
          });
        },
        calculateTokenExpiryTime: () => new Date().getTime() + accessTokenExpiryTime,
        getAccessToken: () => {
          // eslint-disable-next-line no-debugger

          const accessTokenState = get().accessToken;

          if (!accessTokenState) {
            return undefined;
          }

          const now = new Date();

          if (now.getTime() > accessTokenState.expiry) {
            set((state: AuthState) => ({
              accessToken: {
                value: accessTokenState.value,
                expiry: accessTokenState.expiry,
                expired: true,
              },
            }));
            return {
              value: accessTokenState.value,
              expiry: accessTokenState.expiry,
              expired: true,
            };
          }

          return get().accessToken;
        },
        validateAccessTokenExpiry: () => {
          const accessTokenState = get().accessToken;

          if (!accessTokenState) {
            return;
          }

          const now = new Date();

          if (now.getTime() > accessTokenState.expiry) {
            set((state: AuthState) => ({
              accessToken: {
                value: accessTokenState.value,
                expiry: accessTokenState.expiry,
                expired: true,
              },
            }));
          }
        },
        clearTokens: () => {
          set({
            accessToken: undefined,
            accessTokenData: undefined,
          });
        },
      },
    }),
    {
      name: 'tokens',
      partialize: state => ({
        accessToken: state.accessToken,
        accessTokenData: state.accessTokenData,
      }),
    }
  )
);

export const useAccessToken = () => useTokenStore(state => state.accessToken);

export const useAccessTokenData = () => useTokenStore(state => state.accessTokenData);

export const useTokenActions = () => useTokenStore(state => state.actions);

export const rehydrateTokens = () => useTokenStore.persist.rehydrate();
