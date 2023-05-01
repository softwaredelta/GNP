// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { authRouter } from "./user";
import { infraRouter } from "./infra";
import { groupsRouter } from "./group";
import { deliveriesRouter } from "./delivery";
import { salesRouter } from "./sale";
import { assuranceTypeRouter } from "./assuranceType";
import { filesRouter } from "./files";

export const router = Router();

router.use("/user", authRouter);
router.use("/infra", infraRouter);
router.use("/groups", groupsRouter);
router.use("/deliveries", deliveriesRouter);
router.use("/sales", salesRouter);
router.use("/assurance-types", assuranceTypeRouter);
router.use("/files", filesRouter);
