// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { v4 } from "uuid";
import { UserEnt } from "../entities/user.entity";
import { TokenType, generateToken, verifyToken } from "./auth";
import { hashPassword, comparePassword } from "../utils/hash";
export enum UserError {
  USER_EXISTS = "USER_EXISTS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_TOKEN_INVALID = "USER_TOKEN_INVALID",
}

export interface UserAuthentication {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
  refreshTokenExpiresAt: number;
  username: string;
  userRole: string;
}

export async function createUser(params: {
  email: string;
  password: string;
  id?: string;
}): Promise<{ user: UserEnt; error?: UserError }> {
  // TODO: handle authentication with admin or something

  const ds = await getDataSource();
  const id = params.id || v4();
  const hashedPassword = await hashPassword(params.password);
  return ds.manager
    .save(UserEnt, { id, email: params.email, password: hashedPassword })
    .then((user) => {
      return { user };
    })
    .catch((e) => {
      return { error: UserError.USER_EXISTS, user: {} as UserEnt };
    });
}

export async function authenticateUser(params: {
  email: string;
  password: string;
}): Promise<{ auth: UserAuthentication; error?: UserError }> {
  const ds = await getDataSource();
  const user = await ds.manager.findOne(UserEnt, {
    where: {
      email: params.email,
    },
    select: ["id", "email", "password"],
  });
  const correctPass =
    user === null
      ? false
      : await comparePassword(params.password, user.password);
  if (!user || !correctPass) {
    return { error: UserError.USER_NOT_FOUND, auth: {} as UserAuthentication };
  }

  const accessToken = generateToken(user.id, TokenType.AccessToken);
  const refreshToken = generateToken(user.id, TokenType.RefreshToken);

  return {
    auth: {
      accessToken: accessToken.token,
      accessTokenExpiresAt: accessToken.expiresAt,
      refreshToken: refreshToken.token,
      refreshTokenExpiresAt: refreshToken.expiresAt,
      username: user.email,
      userRole: "user",
    },
  };
}

export async function validateUserToken(params: {
  token: string;
}): Promise<{ user: UserEnt; error?: UserError }> {
  const { auth, error } = verifyToken(params.token, TokenType.AccessToken);
  if (error) {
    return { error: UserError.USER_TOKEN_INVALID, user: {} as UserEnt };
  }

  const ds = await getDataSource();
  const user = await ds.manager.findOne(UserEnt, {
    where: {
      id: auth.id,
    },
    select: ["id", "email", "password"],
  });

  if (!user) {
    return { error: UserError.USER_NOT_FOUND, user: {} as UserEnt };
  }

  return { user };
}
