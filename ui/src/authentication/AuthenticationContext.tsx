import { Navigate, useLocation } from "react-router-dom";
import {
  AuthenticatedUser,
  AuthenticationRequest
} from "./types/authentication-types";
import { createContext, useContext } from "react";
import RequestType from "../enum/request-type";
import { jwtDecode } from "jwt-decode";
import routes from "../constants/routes";
import {
  useCredentialActions,
  useCurrentUser,
} from "./store/useCredentialsStore";
import { useTokenActions } from "./store/useTokensStore";
import useRequestHandler from "../hooks/useRequestHandler";
import { apiUrl, createRequestUrl } from "../config/app.config";

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
}

interface AuthenticationProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

function AuthenticationProvider({ children }: AuthenticationProviderProps) {
  const { fetchData, sendData } = useRequestHandler();

  const currentUser = useCurrentUser();

  const { setCurrentUser } = useCredentialActions();

  const { setAccessToken } = useTokenActions();

  const authenticateUser = async (user: AuthenticationRequest) => {
    const response = await sendData<
      AuthenticationRequest,
      AuthenticationResponseDto
    >(createRequestUrl(apiUrl.coreUrl), RequestType.Post, user);

      debugger;

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
  useAuthenticationContext,
};
