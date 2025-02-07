import { Navigate, useLocation } from "react-router-dom";
import {
  AuthenticatedUser,
  AuthenticationRequest,
} from "./context/types/authentication-types";
import { createContext, useContext } from "react";
interface AuthenticationProps {
  currentUser: AuthenticatedUser | null;
  authenticateUser(user: AuthenticationRequest): Promise<boolean>;
  authenticateThirdParty: (
    accessToken: string,
    userId: string
  ) => Promise<boolean>;
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
  const currentUser = useCurrentUser();
  const { setCurrentUser } = useCredentialActions();

  const { setAccessToken } = useTokenActions();

  const { sendData, fetchData } = useRequestHandler();

  const authenticateUser = async (user: AuthenticationRequest) => {
    const response = await sendData<
      AuthenticationRequest,
      AuthenticationResponseDto
    >(
      `https://magnetouat.acibadem.com.tr/anicetus-service/api/authenticate`,
      RequestType.Post,
      user
    );

    if (!response.isSuccess) {
      return false;
    }

    const decodedToken = jwtDecode(response.value.accessToken) as AnicetusToken;

    const headers: HeadersInit = {
      Authorization: `Bearer ${response.value.accessToken}`,
    };

    const auths = await fetchData<AuthorizationResponseDto>(
      `https://magnetouat.acibadem.com.tr/anicetus-service/api/authorizations`,
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

  const authenticateThirdParty = async (
    accessToken: string,
    userId: string
  ) => {
    const response = await sendData<
      ThirdPartyAuthenticationRequest,
      AuthenticationResponse
    >(
      "https://magnetouat.acibadem.com.tr/anicetus-service/api/third-party-authentication",
      RequestType.Post,
      { accessToken: accessToken, userId: userId }
    );

    if (!response.isSuccess) {
      return false;
    }

    const decodedToken = jwtDecode(response.value.accessToken) as AnicetusToken;

    const auths = await fetchData<AuthorizationResponseDto>(
      `https://magnetouat.acibadem.com.tr/anicetus-service/api/authorizations`,
      { userId: decodedToken.UserId }
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
    authenticateThirdParty,
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
