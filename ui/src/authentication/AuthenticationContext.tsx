import { createContext, useContext } from "react";

import { jwtDecode } from "jwt-decode";
import { Navigate, useLocation } from "react-router-dom";

import { apiUrl, createRequestUrl } from "../config/app.config";
import routes from "../constants/routes";
import RequestType from "../enums/request-type";
import useRequestHandler from "../hooks/useRequestHandler";
import {
  useCredentialActions,
  useCurrentUser,
} from "./store/useCredentialsStore";
import { useTokenActions } from "./store/useTokensStore";
import {
  AuthenticatedUser,
  AuthenticationRequest,
} from "./types/authentication-types";

interface AuthenticationProps {
  currentUser: AuthenticatedUser | null;
  authenticateUser(user: AuthenticationRequest): Promise<boolean>;
  logoutUser(): void;
}

const AuthenticationContext = createContext<AuthenticationProps>(null!);

interface AuthenticationResponseDto {
  accessToken: string;
}

interface AnicetusToken {
  UserId: string;
}

interface AuthorizationResponseDto {
  userId: string;
  name: string;
  surname: string;
  right: string[];
}

interface AuthenticationProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

function AuthenticationProvider({ children }: AuthenticationProviderProps) {
  const { fetchData, sendData } = useRequestHandler();

  const currentUser = useCurrentUser();

  const { setCurrentUser, setCurrentUserFunctions } = useCredentialActions();

  const { setAccessToken } = useTokenActions();

  const authenticateUser = async (user: AuthenticationRequest) => {
    const response = await sendData<
      AuthenticationRequest,
      AuthenticationResponseDto
    >(createRequestUrl(apiUrl.coreUrl), RequestType.Post, user);

    if (!response.isSuccess) {
      return false;
    }

    const decodedToken = jwtDecode(response.value.accessToken) as AnicetusToken;

    const headers: HeadersInit = {
      Authorization: `Bearer ${response.value.accessToken}`,
    };

    const auths = await fetchData<AuthorizationResponseDto>(
      createRequestUrl(apiUrl.authorizationsUrl),
      { userId: decodedToken.UserId },
      headers
    );

    if (!auths.isSuccess) return false;

    setCurrentUser({
      name: auths.value.name,
      surname: auths.value.surname,
      userId: auths.value.userId,
    });

    setAccessToken(response.value.accessToken);

    setCurrentUserFunctions(auths.value.right);

    return true;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    authenticateUser,
    logoutUser,
  };

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
}

function useAuthenticationContext() {
  return useContext(AuthenticationContext);
}

function RequireAuthentication({ children }: AuthenticationProviderProps) {
  const auth = useContext(AuthenticationContext);
  const location = useLocation();

  if (!auth.currentUser) {
    return <Navigate to={routes.login} state={{ from: location }} replace />;
  }

  return children;
}

export {
  AuthenticationProvider,
  RequireAuthentication,
  // eslint-disable-next-line react-refresh/only-export-components
  useAuthenticationContext,
};
