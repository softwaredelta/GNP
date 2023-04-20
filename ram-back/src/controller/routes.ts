// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { authRouter } from "./user";
import { infraRouter } from "./infra";
import { groupsRouter } from "./group";

export const router = Router();

router.use("/user", authRouter);
router.use("/infra", infraRouter);
router.use("/groups", groupsRouter);
