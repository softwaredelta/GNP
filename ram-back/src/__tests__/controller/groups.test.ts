// (c) Delta Software 2023, rights reserved.

import request from "supertest";
import { getDataSource } from "../../arch/db-client";
import { app } from "../../controller";
import { authenticateUser } from "../../app/user";
import { DataSource } from "typeorm";
import { GroupEnt } from "../../entities/group.entity";
import { createGroup } from "../../app/groups";
import { userSeeds } from "../../seeds";
import { UserEnt } from "../../entities/user.entity";

describe("controller:groups", () => {
  let ds: DataSource;
  let group: GroupEnt;
  let regularUser: UserEnt;
  let managerUser: UserEnt;
  beforeEach(async () => {
    ds = await getDataSource();
    await ds.synchronize(true);

    const { group: createdGroup, error } = await createGroup({
      name: "controller-test-group",
    });
    if (error) {
      throw new Error(error);
    }

    const { regular, manager } = await userSeeds();
    regularUser = regular;
    managerUser = manager;

    group = createdGroup;
  });

  describe("authentication", () => {
    it("rejects unauthenticated request", async () => {
      return request(app).delete(`/groups/${group.id}`).send().expect(401);
    });

    it("rejects non-admin request", async () => {
      const { auth } = await authenticateUser({
        email: regularUser.email,
        password: "password",
      });
      expect(auth).toBeDefined();

      return request(app)
        .delete(`/groups/${group.id}`)
        .set("Authorization", `Bearer ${auth.accessToken}`)
        .send()
        .expect(403);
    });

    it("accepts admin request", async () => {
      const { auth } = await authenticateUser({
        email: managerUser.email,
        password: "password",
      });
      expect(auth).toBeDefined();

      return request(app)
        .delete(`/groups/${group.id}`)
        .set("Authorization", `Bearer ${auth.accessToken}`)
        .send()
        .expect(200);
    });
  });

  describe("validation", () => {
    it("does nothing on bad id", async () => {
      const { auth } = await authenticateUser({
        email: managerUser.email,
        password: "password",
      });
      expect(auth).toBeDefined();

      return request(app)
        .delete(`/groups/bad-id`)
        .set("Authorization", `Bearer ${auth.accessToken}`)
        .send()
        .expect(200);
    });

    it("works on good id", async () => {
      const { auth } = await authenticateUser({
        email: managerUser.email,
        password: "password",
      });
      expect(auth).toBeDefined();

      await request(app)
        .delete(`/groups/${group.id}`)
        .set("Authorization", `Bearer ${auth.accessToken}`)
        .send()
        .expect(200);
    });
  });
});
