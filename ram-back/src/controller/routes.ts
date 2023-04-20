// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { authRouter } from "./user";
import { infraRouter } from "./infra";
import { groupRouter } from "./group";
import {userDeliveryRouter} from "./user-delivery";

export const router = Router();

router.use("/user", authRouter);
router.use("/infra", infraRouter);
router.use("/group", groupRouter);
router.use("/user-delivery", userDeliveryRouter);
