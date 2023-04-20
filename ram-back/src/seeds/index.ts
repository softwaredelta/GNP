// (c) Delta Software 2023, rights reserved.

import { addUserToGroup, createGroup } from "../app/groups";
import { createUser } from "../app/user";

/**
 * Make sure to specify ids so things stay consistent
 */

export async function loadSeeds() {
  try {
    // USERS
    await createUser({
      email: "test@delta.tec.mx",
      password: "test-password",
      id: "test-user",
    });
    const group1 = await createGroup({
      name: "test-group-1",
    });
    const group2 = await createGroup({
      name: "test-group-2",
    });
    await createGroup({
      name: "test-group-3",
    });

    await addUserToGroup({
      userId: "test-user",
      groupId: group1.group.id,
    });
    await addUserToGroup({
      userId: "test-user",
      groupId: group2.group.id,
    });
  } catch (e) {
    console.error(e);
  }
}
