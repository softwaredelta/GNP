// (c) Delta Software 2023, rights reserved.

import { RequestHandler, Router } from "express";
import { getDataSource } from "../arch/db-client";
import { UserEnt, UserRole } from "../entities/user.entity";
import { TokenType, generateToken, verifyToken } from "../app/auth";
import { authenticateUser, createUser, validateUserToken } from "../app/user";
import * as j from "joi";

export const authRouter = Router();

const userParameters = j.object({
  email: j.string().email().required(),
  password: j.string().min(8).required(),
});

const userParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = userParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }

  next();
};

authRouter.post("/create", userParametersMiddleware, async (req, res) => {
  const { email, password } = req.body;
  // TODO: validation

  const { user, error } = await createUser({ email, password });
  if (error) {
    res.status(400).json({ message: error });
    return;
  }

  res.json(user);
});

authRouter.post("/authenticate", userParametersMiddleware, async (req, res) => {
  const { email, password } = req.body;
  // TODO: validation

  const { auth, error } = await authenticateUser({ email, password });
  if (error) {
    res.status(401).json({ message: error });
    return;
  }

  res.json(auth);
});

// ALL requested roles must be present
export const authMiddleware = (
  params: {
    neededRoles?: UserRole[];
  } = {},
): RequestHandler => {
  const neededRoles = params.neededRoles || [];

  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).json({ message: "No authorization header" });
      return;
    }

    const [type, token] = authorization.split(" ");
    if (type !== "Bearer") {
      res.status(401).json({ message: "Invalid authorization type" });
      return;
    }

    const { user, error } = await validateUserToken({ token });
    if (error) {
      res.status(401).json({ message: error });
      return;
    }

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    if (neededRoles.length > 0) {
      const hasRoles = neededRoles.every((neededRole) =>
        user.roles.includes(neededRole),
      );
      if (!hasRoles) {
        res.status(403).json({ message: "Insufficient permissions" });
        return;
      }
    }

    req.user = user;

    next();
  };
};

authRouter.get(
  "/me",
  authMiddleware({ neededRoles: [UserRole.REGULAR] }),
  async (req, res) => {
    res.json(req.user);
  },
);

// this is purely an example and currently serves no purpose for the app
// see tests
authRouter.get(
  "/admin",
  authMiddleware({ neededRoles: [UserRole.ADMIN] }),
  async (req, res) => {
    res.json(req.user);
  },
);

authRouter.post("/refresh", async (req, res) => {
  const { refreshToken, refreshTokenExpiresAt } = req.body;

  const { auth, error } = verifyToken(refreshToken, TokenType.RefreshToken);
  if (error) {
    res.status(401).json({ message: error.message });
    return;
  }

  const ds = await getDataSource();
  const user = await ds.manager.findOne(UserEnt, {
    where: {
      id: auth.id,
    },
    select: ["id", "email", "rolesString"],
  });

  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const accessToken = generateToken(user.id, TokenType.AccessToken);

  res.json({
    accessToken: accessToken.token,
    accessTokenExpiresAt: accessToken.expiresAt,
    refreshToken,
    refreshTokenExpiresAt,
    username: user.email,
    roles: user.roles,
  });
});
