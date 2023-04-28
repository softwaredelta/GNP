// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { v4 } from "uuid";
import {
  UserEnt,
  UserRole,
  buildRoleString,
  rolesFromString,
} from "../entities/user.entity";
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
  roles: UserRole[];
}

export async function createUser(params: {
  email: string;
  password: string;
  id?: string;
  roles?: UserRole[];
  iamgeURL?: string;
}): Promise<{ user: UserEnt; error?: UserError }> {
  // TODO: handle authentication with admin or something

  const ds = await getDataSource();
  const id = params.id || v4();
  const hashedPassword = await hashPassword(params.password);
  const roles = params.roles || [UserRole.REGULAR];

  return ds.manager
    .save(
      UserEnt,
      ds.manager.create(UserEnt, {
        id,
        email: params.email,
        password: hashedPassword,
        rolesString: buildRoleString(roles),
        imageURL: params.iamgeURL ?? "https://picsum.photos/200",
      }),
    )
    .then((user) => {
      return { user };
    })
    .catch(() => {
      return { error: UserError.USER_EXISTS, user: {} as UserEnt };
    });
}

export async function addRoleToUser(params: {
  userId: string;
  role: UserRole;
}): Promise<{ error?: UserError }> {
  const ds = await getDataSource();
  const user = await ds.manager.findOne(UserEnt, {
    where: {
      id: params.userId,
    },
    select: ["id", "rolesString"],
  });

  if (!user) {
    return { error: UserError.USER_NOT_FOUND };
  }

  const roles = rolesFromString(user.rolesString);
  if (roles.includes(params.role)) {
    return {};
  }

  roles.push(params.role);
  const newRoleString = buildRoleString(roles);
  await ds.manager.update(
    UserEnt,
    { id: params.userId },
    { rolesString: newRoleString },
  );

  return {};
}

export async function removeRoleFromUser(params: {
  userId: string;
  role: UserRole;
}): Promise<{ error?: UserError }> {
  const ds = await getDataSource();
  const user = await ds.manager.findOne(UserEnt, {
    where: {
      id: params.userId,
    },
    select: ["id", "rolesString"],
  });

  if (!user) {
    return { error: UserError.USER_NOT_FOUND };
  }

  const roles = rolesFromString(user.rolesString);
  if (!roles.includes(params.role)) {
    return {};
  }

  const newRoleString = buildRoleString(
    roles.filter((role) => role !== params.role),
  );
  await ds.manager.update(
    UserEnt,
    { id: params.userId },
    { rolesString: newRoleString },
  );

  return {};
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
    select: ["id", "email", "password", "rolesString"],
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
      roles: user.roles,
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
    select: ["id", "email", "rolesString"],
  });

  if (!user) {
    return { error: UserError.USER_NOT_FOUND, user: {} as UserEnt };
  }

  return { user };
}
