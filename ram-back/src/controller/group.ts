// (c) Delta Software 2023, rights reserved.

import { RequestHandler, Router } from "express";
import * as J from "joi";
import * as j from "joi";
import multer from "multer";
import {
  GroupError,
  addUserToGroup,
  createGroup,
  createGroupWithFile,
  deleteGroup,
  getUserGroups,
  getUsersByGroup,
  removeUserFromGroup,
  updateGroup,
  updateGroupWithFile,
} from "../app/groups";
import { getDataSource } from "../arch/db-client";
import { GroupEnt } from "../entities/group.entity";
import { UserRole } from "../entities/user.entity";
import { authMiddleware } from "./user";
import { setUserToAllDeliveries } from "../app/user-delivery";

export const groupsRouter = Router();
const upload = multer();

const updateParameters = j.object({
  name: j.string(),
  description: j.string(),
  imageUrl: j.string(),
});

const updateParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = updateParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
  next();
};

groupsRouter.get(
  "/all",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const ds = await getDataSource();
    const groups = await ds.manager.find(GroupEnt, {
      select: ["id", "name", "description", "imageURL", "groupUsers"],
      relations: ["groupUsers"],
    });

    res.json(groups);
  },
);

groupsRouter.get("/my-groups", authMiddleware(), async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "No user" });
    return;
  }
  const userId = req.user.id;

  const data = await getUserGroups({ userId });

  res.json({ data });
});

groupsRouter.get("/:id", async (req, res) => {
  const ds = await getDataSource();
  const groups = await ds.manager.findOne(GroupEnt, {
    select: ["id", "name", "deliveries"],
    relations: ["deliveries", "deliveries.userDeliveries"],
    where: {
      id: req.params.id,
    },
  });

  res.json(groups);
});

groupsRouter.get(
  "/users/:id",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    try {
      const groupUsers = await getUsersByGroup(req.params.id);
      res.json(groupUsers);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving group users", error });
    }
  },
);

groupsRouter.delete(
  "/:id",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    await deleteGroup({
      groupId: req.params.id,
    });

    res.status(200).send();
  },
);

groupsRouter.post(
  "/create",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  upload.single("image"),
  async (req, res) => {
    const schema = J.object({
      name: J.string().min(3).required(),
      description: J.string().allow("").optional(),
    });

    const { error: validationError } = schema.validate(req.body);
    if (validationError) {
      res.status(400).json({ message: validationError.message });
      return;
    }

    const { name, description } = req.body;
    const file = req.file;

    let data;
    if (file) {
      data = await createGroupWithFile({
        name,
        description,
        imageFile: file,
      });
    } else {
      data = await createGroup({
        name,
        description,
      });
    }

    const { group, error } = data;
    if (error) {
      if (error === GroupError.CONFLICT) {
        res.status(409).json({ message: "Group already exists" });
        return;
      }
      res.status(500).json({ error });
    } else {
      res.status(201).json(group);
    }
  },
);

groupsRouter.put(
  "/update/:groupId",
  updateParametersMiddleware,
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  upload.single("image"),
  async (req, res) => {
    const { groupId } = req.params;

    const schema = J.object({
      name: J.string().min(3).optional(),
      description: J.string().allow("").optional(),
    });

    const { error: validationError } = schema.validate(req.body);
    if (validationError) {
      res.status(400).json({ message: validationError.message });
      return;
    }

    const { name, description } = req.body;
    const file = req.file;

    let data;
    if (file) {
      data = await updateGroupWithFile({
        groupId,
        name,
        description,
        imageFile: file,
      });
    } else {
      data = await updateGroup({
        groupId,
        name,
        description,
      });
    }

    const { group, error, errorReason } = data;
    if (error) {
      if (error === GroupError.NOT_FOUND) {
        res.status(404).json({ message: "Group not found" });
      } else {
        res.status(500).json({ error, errorReason });
      }
    } else {
      res.json(group);
    }
  },
);

groupsRouter.post(
  "/:id/add-user",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res, next) => {
    const schema = J.object({
      userId: J.string().required(),
    });
    const { error: validationError } = schema.validate(req.query);
    if (validationError) {
      res.status(400).json({ message: validationError.message });
      return;
    }

    next();
  },
  async (req, res) => {
    const userId = req.query.userId as string;
    const groupId = req.params.id;

    await addUserToGroup({ groupId, userId });
    await setUserToAllDeliveries({
      groupId,
      userId,
    });
    res.status(200).send();
  },
);

groupsRouter.post(
  "/:id/remove-user",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res, next) => {
    const schema = J.object({
      userId: J.string().required(),
    });
    const { error: validationError } = schema.validate(req.query);
    if (validationError) {
      res.status(400).json({ message: validationError.message });
      return;
    }

    next();
  },
  async (req, res) => {
    const userId = req.query.userId as string;
    const groupId = req.params.id;

    const { error, errorReason } = await removeUserFromGroup({
      groupId,
      userId,
    });
    if (error) {
      res.status(500).json({ error, errorReason });
      console.error(errorReason);
      return;
    }

    res.status(200).send();
  },
);
