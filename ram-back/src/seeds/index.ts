// (c) Delta Software 2023, rights reserved.

import { createUser } from "../app/user";

/**
 * Make sure to specify ids so things stay consistent
 */

export async function loadSeeds() {
  // USERS
  await createUser({
    email: "test@delta.tec.mx",
    password: "test-password",
    id: "test-user",
  });
}
