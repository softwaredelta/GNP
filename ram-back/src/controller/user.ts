// (c) Delta Software 2023, rights reserved.

import { RequestHandler, Router } from "express";
import * as j from "joi";
import { TokenType, generateToken, verifyToken } from "../app/auth";
import {
  authenticateUser,
  createUser,
  fuzzySearchUsers,
  validateUserToken,
  getAllUserRol,
  updateUser,
  resetPassword,
  addLink,
  updateLink,
} from "../app/user";
import { getDataSource } from "../arch/db-client";
import { UserEnt, UserRole } from "../entities/user.entity";
import multer from "multer";
import { uploadFile } from "../app/file";
import { UserLinkEnt } from "../entities/user-link.entity";

const upload = multer();

export const authRouter = Router();

const userParameters = j.object({
  email: j.string().email().required(),
  password: j.string().min(8).required(),
  confirmPassword: j.string().valid(j.ref("password")).optional(),
  name: j.string().optional(),
  lastName: j.string().optional(),
  mobile: j.number().optional(),
  role: j.string().valid(UserRole.MANAGER, UserRole.REGULAR).optional(),
  urlPP200: j.string().optional().allow("").default(""),
  CUA: j.string().optional().allow("").default(""),
});

const resetPasswordParameters = j.object({
  email: j.string().email().required(),
  password: j.string().min(8).required(),
});

const resetPasswordParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = resetPasswordParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
  next();
};

const userParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = userParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }

  next();
};

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

    if (user.roles.includes(UserRole.ADMIN)) {
      req.user = user;
      next();
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

authRouter.post(
  "/create",
  userParametersMiddleware,
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const { email, password, name, lastName, role, mobile, urlPP200, CUA } =
      req.body;
    // TODO: validation

    const { user, error } = await createUser({
      email,
      password,
      name,
      lastName,
      urlPP200,
      CUA,
      roles: [role],
      mobile,
    });
    if (error) {
      res.status(400).json({ message: error });
      return;
    }

    res.json(user);
  },
);

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

authRouter.get(
  "/me",
  authMiddleware({ neededRoles: [UserRole.REGULAR] }),
  async (req, res) => {
    res.json(req.user);
  },
);

authRouter.get("/all-agents", async (req, res) => {
  const db = await getDataSource();
  const sales = await db.manager.find(UserEnt, {
    where: {
      rolesString: UserRole.REGULAR,
    },
    select: ["id", "email", "name", "lastName", "CUA"],
  });
  res.json(sales);
});

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
    select: ["id", "email", "name", "lastName", "rolesString"],
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
    name: user.name,
    lastName: user.lastName,
    roles: user.roles,
  });
});

authRouter.get(
  "/fuzzy-search",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res, next) => {
    const schema = j.object({
      query: j.string().allow("").required(),
    });
    const { error } = schema.validate(req.query);
    if (error) {
      res.status(400).json({ message: "BAD_DATA", reason: error });
      return;
    }
    next();
  },
  async (req, res) => {
    const users = await fuzzySearchUsers({
      query: req.query.query as string,
    });

    res.json(users);
  },
);

authRouter.get(
  "/members",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const { userRol } = await getAllUserRol();
    res.json(userRol);
  },
);

authRouter.get("/:id", authMiddleware(), async (req, res) => {
  const db = await getDataSource();
  const user = await db.manager.findOne(UserEnt, {
    where: { id: req.params.id },
    relations: ["userLinks"],
  });

  res.json(user);
});

authRouter.post(
  "/update/:id",
  authMiddleware(),
  upload.single("file"),
  async (req, res) => {
    const { email, name, lastName, mobile, urlPP200, CUA } = req.body;
    const { user } = req;
    if (!user) {
      res.status(401).json({ message: "NO_USER" });
      return;
    }

    const { file } = req;

    if (!file && !req.body.imageUrl) {
      res.status(400).json({ message: "NO_FILE_UPLOAD" });
      return;
    }

    const imageUrl = !!file ? await uploadFile({ file }) : req.body.imageUrl;

    const { user: modifiedUser, error } = await updateUser({
      id: req.params.id,
      email,
      name,
      lastName,
      mobile,
      urlPP200,
      CUA,
      imageUrl: imageUrl,
    });

    if (error) {
      res.status(500).json({ message: error });
      return;
    }

    res.json({ modifiedUser });
  },
);

authRouter.post(
  "/reset-password",
  authMiddleware(),
  resetPasswordParametersMiddleware,
  async (req, res) => {
    const { email, password } = req.body;
    const { error } = await resetPassword({ email, password });
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.json({ message: "Password reset successfully" });
  },
);

authRouter.post("/add-link/:id", authMiddleware(), async (req, res) => {
  const { link, name } = req.body;

  const { user } = req;

  if (!user) {
    res.status(401).json({ message: "NO_USER" });
    return;
  }

  const { link: newLink, error } = await addLink({
    id: req.params.id,
    link,
    name,
  });

  if (error) {
    res.status(500).json({ message: error });
    return;
  }

  res.json({ newLink });
});

authRouter.post("/edit-link", authMiddleware(), async (req, res) => {
  const { link, name, id } = req.body;

  const { user } = req;

  if (!user) {
    res.status(401).json({ message: "NO_USER" });
    return;
  }

  const { link: uLink, error } = await updateLink({
    id,
    link,
    name,
  });

  if (error) {
    res.status(500).json({ message: error });
    return;
  }

  res.json({ uLink });
});

authRouter.post("/delete-link", authMiddleware(), async (req, res) => {
  const { user } = req;

  if (!user) {
    res.status(401).json({ message: "NO_USER" });
    return;
  }

  const db = await getDataSource();
  const links = await db.manager
    .getRepository(UserLinkEnt)
    .delete(req.body.id)
    .catch((err) => {
      res.status(500).json({ message: err });
      return;
    });

  res.json({ links });
});

authRouter.get("/links/:id", authMiddleware(), async (req, res) => {
  const { user } = req;

  if (!user) {
    res.status(401).json({ message: "NO_USER" });
    return;
  }

  const db = await getDataSource();
  const links = await db.manager.find(UserLinkEnt, {
    where: { userId: req.params.id },
  });

  res.json({ links });
});
