// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { authRouter } from "./user";
import { infraRouter } from "./infra";
<<<<<<< HEAD
import { groupsRouter } from "./group";
import { salesRouter } from "./sale";
import { assuranceTypeRouter } from "./assuranceType";
=======
import { salesRouter } from "./sale";
>>>>>>> 23639a06391f34e99408a102d8ab1c7dc352d37e

export const router = Router();

router.use("/user", authRouter);
router.use("/infra", infraRouter);
<<<<<<< HEAD
router.use("/groups", groupsRouter);
router.use("/sales", salesRouter);
router.use("/assurance-types", assuranceTypeRouter);
=======
router.use("/sales", salesRouter);
>>>>>>> 23639a06391f34e99408a102d8ab1c7dc352d37e
