// (c) Delta Software 2023, rights reserved.

import { v4 } from "uuid";
import { getDataSource } from "../arch/db-client";
import {
  UserEnt,
  UserRole,
  buildRoleString,
  rolesFromString,
} from "../entities/user.entity";
import { comparePassword, hashPassword } from "../utils/hash";
import { TokenType, generateToken, verifyToken } from "./auth";
import { UserLinkEnt } from "../entities/user-link.entity";

export enum UserError {
  USER_EXISTS = "USER_EXISTS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_TOKEN_INVALID = "USER_TOKEN_INVALID",
  UNHANDLED_ERROR = "UNHANDLED_ERROR",
}

export enum UserLinkError {
  NOT_FOUND = "LINK_NOT_FOUND",
  EXISTS = "LINK_EXISTS",
}

export interface UserRol {
  id: string;
  rol: string;
  name: string;
  lastName: string;
  isActive: boolean;
  imageUrl?: string;
}

export interface UserAuthentication {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
  refreshTokenExpiresAt: number;
  username: string;
  name: string;
  lastName: string;
  roles: UserRole[];
}

export async function createUser(params: {
  email: string;
  password: string;
  name?: string;
  lastName?: string;
  mobile?: number;
  id?: string;
  roles?: UserRole[];
  imageUrl?: string;
  urlPP200?: string;
  CUA?: string;
}): Promise<{ user: UserEnt; error?: UserError }> {
  // TODO: handle authentication with admin or something

  const ds = await getDataSource();
  const id = params.id || v4();
  const hashedPassword = await hashPassword(params.password);
  const roles = params.roles || [UserRole.REGULAR];
  const mobile = params.mobile || 10000000000;
  const urlPP200 = params.urlPP200 || "";
  const CUA = params.CUA || "";

  return ds.manager
    .save(
      UserEnt,
      ds.manager.create(UserEnt, {
        id,
        email: params.email,
        name: params.name,
        mobile,
        urlPP200,
        CUA,
        lastName: params.lastName,
        password: hashedPassword,
        rolesString: buildRoleString(roles),
        imageUrl: params.imageUrl ?? "https://picsum.photos/200",
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
    select: ["id", "email", "name", "lastName", "password", "rolesString"],
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
      name: user.name,
      lastName: user.lastName,
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

export async function fuzzySearchUsers(params: {
  query: string;
}): Promise<UserEnt[]> {
  const ds = await getDataSource();
  const users = await ds
    .createQueryBuilder()
    .from(UserEnt, "UserEnt")
    .select(["UserEnt.id", "UserEnt.name", "UserEnt.lastName"])
    .where("UserEnt.name LIKE :query", {
      query: `%${params.query.toLowerCase()}%`,
    })
    .orWhere("UserEnt.lastName LIKE :query", {
      query: `%${params.query.toLowerCase()}%`,
    })
    .orderBy("UserEnt.name", "ASC")
    .getMany();

  return users;
}

const userToUserRol = (user: UserEnt): UserRol => {
  return {
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    isActive: user.isActive,
    imageUrl: user.imageUrl,
    rol: user.roles[0],
  };
};

export async function getAllUserRol(): Promise<{
  userRol: UserRol[];
  error?: UserError;
}> {
  const ds = await getDataSource();
  const users = await ds
    .createQueryBuilder()
    .from(UserEnt, "UserEnt")
    .select([
      "UserEnt.id",
      "UserEnt.name",
      "UserEnt.lastName",
      "UserEnt.isActive",
      "UserEnt.imageUrl",
      "UserEnt.rolesString",
    ])
    .orderBy("UserEnt.name", "ASC")
    .getMany();
  if (!users) {
    return { error: UserError.USER_NOT_FOUND, userRol: [] as UserRol[] };
  }

  return { userRol: users.map((user) => userToUserRol(user)) };
}

export async function getAgentById(agentId: string): Promise<string> {
  const ds = await getDataSource();

  try {
    const agent = await ds.manager.find(UserEnt, {
      select: ["name", "lastName"],
      where: {
        id: agentId,
      },
    });

    if (agent.length === 0 || !agent) {
      return "";
    }
    return `${agent[0].name} ${agent[0].lastName ? agent[0].lastName : ""}`;
  } catch (err) {
    return "";
  }
}

export async function updateUser(params: {
  email?: string;
  name?: string;
  lastName?: string;
  mobile?: number;
  id: string;
  imageUrl?: string;
  urlPP200?: string;
  CUA?: string;
}): Promise<{ user: UserEnt; error?: UserError; errorReason?: Error }> {
  const ds = await getDataSource();
  const existingUser = await ds.manager.findOne(UserEnt, {
    where: { id: params.id },
  });
  if (!existingUser) {
    return {
      error: UserError.USER_NOT_FOUND,
      user: {} as UserEnt,
      errorReason: new Error("User not found"),
    };
  }
  return ds.manager
    .update(UserEnt, params.id, {
      email: params.email,
      name: params.name,
      lastName: params.lastName,
      mobile: params.mobile,
      imageUrl: params.imageUrl,
      urlPP200: params.urlPP200,
      CUA: params.CUA,
    })
    .then(async () => {
      const user = await ds.manager.findOneOrFail(UserEnt, {
        where: { id: params.id },
      });
      if (user) return { user };
      else
        return {
          user: {} as UserEnt,
          error: UserError.USER_NOT_FOUND,
          errorReason: new Error("User not found"),
        };
    })
    .catch((e) => ({
      error: UserError.UNHANDLED_ERROR as UserError,
      errorReason: e as Error,
      user: {} as UserEnt,
    }));
}

export async function resetPassword(params: {
  email: string;
  password: string;
}): Promise<{ error?: UserError }> {
  const ds = await getDataSource();
  const user = await ds.manager.findOne(UserEnt, {
    where: {
      email: params.email,
    },
    select: ["id", "email", "password"],
  });
  if (!user) {
    return { error: UserError.USER_NOT_FOUND };
  }
  const newPassword = params.password;
  const hashedPassword = await hashPassword(newPassword);
  await ds.manager.update(UserEnt, user.id, { password: hashedPassword });
  return {};
}

export async function addLink(params: {
  id: string;
  link: string;
  name: string;
}): Promise<{ link: UserLinkEnt; error?: UserError }> {
  const ds = await getDataSource();
  const user = await ds.manager.findOne(UserEnt, {
    where: {
      id: params.id,
    },
  });
  if (!user) {
    return { link: {} as UserLinkEnt, error: UserError.USER_NOT_FOUND };
  }
  return ds.manager
    .save(
      UserLinkEnt,
      ds.manager.create(UserLinkEnt, {
        user: user,
        name: params.name,
        link: params.link,
        userId: params.id,
      }),
    )
    .then((link) => {
      return { link };
    })
    .catch(() => {
      return { error: UserError.USER_EXISTS, link: {} as UserLinkEnt };
    });
}

export async function updateLink(params: {
  id: string;
  link?: string;
  name?: string;
}): Promise<{ link: UserLinkEnt; error?: UserLinkError }> {
  const ds = await getDataSource();
  const existingLink = await ds.manager.findOne(UserLinkEnt, {
    where: {
      id: params.id,
    },
  });
  if (!existingLink) {
    return { link: {} as UserLinkEnt, error: UserLinkError.NOT_FOUND };
  }
  return ds.manager
    .update(UserLinkEnt, params.id, { name: params.name, link: params.link })
    .then(async () => {
      const link = await ds.manager.findOneOrFail(UserLinkEnt, {
        where: { id: params.id },
      });
      if (link) return { link };
      else return { link: {} as UserLinkEnt, error: UserLinkError.NOT_FOUND };
    })
    .catch(() => {
      return { error: UserLinkError.EXISTS, link: {} as UserLinkEnt };
    });
}
