// (c) Delta Software 2023, rights reserved.

import jwt from "jsonwebtoken";

// TODO: FIXME
const jwtSecret = "secret";

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

/**
 * This function generates a token with a specified ID and type, using JWT and sets an expiration time
 * based on the token type.
 * @param {string} id - A string representing the user ID for whom the token is being generated.
 * @param {TokenType} type - TokenType is an enum that specifies the type of token being generated,
 * either an access token or a refresh token.
 * @returns The function `generateToken` returns an object of type `Token`, which contains a `token`
 * string and an `expiresAt` number representing the expiration time of the token in milliseconds since
 * the Unix epoch.
 */
export const generateToken = (id: string, type: TokenType): Token => {
  const payload: AuthPayload = {
    id: id,
    tokenType: type,
  };
  const expires = type === TokenType.AccessToken ? "1h" : "1d";
  const token = jwt.sign(payload, jwtSecret, { expiresIn: expires });
  const secondsToExpire = type === TokenType.AccessToken ? 3600 : 86400;
  return {
    token,
    expiresAt: /* utc */ Date.now() + secondsToExpire * 1000,
  };
};

/**
 * This is a TypeScript function that verifies a token and returns an authentication payload or an
 * error.
 * @param {string} token - The token string that needs to be verified.
 * @param {TokenType} type - The `type` parameter is a `TokenType` enum value that specifies the type
 * of token being verified. It is used to check if the decoded token matches the expected type.
 * @returns The function `verifyToken` returns an object with two properties: `auth` and `error`. The
 * `auth` property contains an `AuthPayload` object if the token is valid and matches the specified
 * `type`. The `error` property contains an `Error` object if the token is invalid or does not match
 * the specified `type`.
 */
export const verifyToken = (
  token: string,
  type: TokenType,
): {
  auth: AuthPayload;
  error?: Error;
} => {
  try {
    const decoded = jwt.verify(token, jwtSecret);

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
