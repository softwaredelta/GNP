// (c) Delta Software 2023, rights reserved.

import jwt from "jsonwebtoken";

// TODO: FIXME
const SECRET = "Secret_delta";

export enum TokenType {
  AccessToken = "accessToken",
  RefreshToken = "refreshToken",
}

export interface Token {
  token: string;
  expiresAt: number;
}

export interface AuthPayload {
  id: string;
  tokenType: TokenType;
}

export const generateToken = (id: string, type: TokenType): Token => {
  const payload: AuthPayload = {
    id: id,
    tokenType: type,
  };
  const expires = type === TokenType.AccessToken ? "1h" : "1d";
  const token = jwt.sign(payload, SECRET, { expiresIn: expires });

  const secondsToExpire = type === TokenType.AccessToken ? 3600 : 86400;
  return {
    token,
    expiresAt: /* utc */ Date.now() + secondsToExpire * 1000,
  };
};

export const verifyToken = (
  token: string,
  type: TokenType,
): {
  auth: AuthPayload;
  error?: Error;
} => {
  try {
    const decoded = jwt.verify(token, SECRET);

    if (decoded) {
      const { tokenType } = decoded as AuthPayload;
      if (tokenType !== type) {
        throw new Error("Invalid token type");
      }
    }

    return { auth: decoded as AuthPayload };
  } catch (err) {
    return { error: new Error("Invalid token"), auth: {} as AuthPayload };
  }
};
