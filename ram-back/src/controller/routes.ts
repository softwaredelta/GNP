// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { authRouter } from "./user";
import { infraRouter } from "./infra";
import { groupsRouter } from "./group";
import { deliveriesRouter } from "./delivery";
import { salesRouter } from "./sale";
import { assuranceTypeRouter } from "./assuranceType";
import { filesRouter } from "./files";
import { userDeliveryRouter } from "./user-delivery";
import { prospectRouter } from "./prospect";
import { statusRouter } from "./status";
import { statusProspectRouter } from "./status-prospect";

export const router = Router();

router.use("/user", authRouter);
router.use("/infra", infraRouter);
router.use("/groups", groupsRouter);
router.use("/user-delivery", userDeliveryRouter);
router.use("/deliveries", deliveriesRouter);
router.use("/sales", salesRouter);
router.use("/assurance-types", assuranceTypeRouter);
router.use("/files", filesRouter);
router.use("/prospect", prospectRouter);
router.use("/status", statusRouter);
router.use("/status-prospect", statusProspectRouter);
