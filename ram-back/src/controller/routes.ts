// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { authRouter } from "./user";
import { infraRouter } from "./infra";

export const router = Router();

router.use("/user", authRouter);
router.use("/infra", infraRouter);
