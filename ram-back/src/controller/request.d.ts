// (c) Delta Software 2023, rights reserved.

import { UserEnt } from "../entities/user.entity";

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: UserEnt;
    }
  }
}
