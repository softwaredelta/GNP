// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import * as J from "joi";
import multer from "multer";
import {
  GroupError,
  createGroup,
  createGroupWithFile,
  deleteGroup,
  getUserGroups,
  getUsersByGroup,
} from "../app/groups";
import { getDataSource } from "../arch/db-client";
import { GroupEnt } from "../entities/group.entity";
import { UserRole } from "../entities/user.entity";
import { authMiddleware } from "./user";

export const groupsRouter = Router();
const upload = multer();

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
      description: J.string().allow("").required(),
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
