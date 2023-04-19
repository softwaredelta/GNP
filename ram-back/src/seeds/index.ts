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
  } catch (e) {
    console.error(e);
  }

  try {
    //GROUP
    await createGroup({
      id: "dfs",
      name: "group 2",
    });
  } catch (e) {
    console.error(e);
  }

  try {
    // GROUP
    await addUserToGroup({
      userId: "test-user",
      groupId: "course-1",
    });
  } catch (e) {
    console.error(e);
  }
}
