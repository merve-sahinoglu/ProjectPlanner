import { z } from "zod";

interface AuthenticatedUser {
  userId: string;
  name: string;
  surname: string;
}

interface AuthenticationResponse {
  accessToken: string;
}

type AuthenticationRequest = {
  username: string;
  password: string;
};

type ThirdPartyAuthenticationRequest = {
  userId: string;
  accessToken: string;
};

type Token = {
  value: string;
  expiry: number;
  expired: boolean;
};

export const TokenDataSchema = z.object({
  UserId: z.string(),
});

type TokenData = z.infer<typeof TokenDataSchema>;

export type {
  AuthenticatedUser,
  AuthenticationResponse,
  AuthenticationRequest,
  ThirdPartyAuthenticationRequest,
  Token,
  TokenData,
};
