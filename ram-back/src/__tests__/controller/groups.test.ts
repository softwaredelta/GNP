// (c) Delta Software 2023, rights reserved.

import request from "supertest";
import { getDataSource } from "../../arch/db-client";
import { app } from "../../controller";
import { DataSource } from "typeorm";
import { GroupEnt } from "../../entities/group.entity";
import { createGroup } from "../../app/groups";
import { userSeeds } from "../../seeds";

describe("controller:groups", () => {
  let ds: DataSource;
  let group: GroupEnt;
  let managerAccessToken: string;
  let regularAccessToken: string;
  beforeEach(async () => {
    ds = await getDataSource();
    await ds.synchronize(true);

    const { group: createdGroup, error } = await createGroup({
      name: "controller-test-group",
    });
    expect(error).toBeUndefined();
    group = createdGroup;

    await userSeeds();

    const authenticationResponse = await request(app)
      .post("/user/authenticate")
      .send({
        email: "manager@delta.tec.mx",
        password: "password",
      })
      .then((res) => res.body);

    managerAccessToken = authenticationResponse.accessToken;

    const regularAuthenticationResponse = await request(app)
      .post("/user/authenticate")
      .send({
        email: "regular@delta.tec.mx",
        password: "password",
      })
      .then((res) => res.body);

    regularAccessToken = regularAuthenticationResponse.accessToken;
  });

  describe("create group endpoint", () => {
    describe("autentication", () => {
      it("rejects unauthenticated requests", async () => {
        return request(app)
          .post("/groups/create")
          .send({
            name: "group/1",
            description: "description",
          })
          .expect(401);
      });

      it("rejects requests from non-managers", async () => {
        return request(app)
          .post("/groups/create")
          .set("Authorization", `Bearer ${regularAccessToken}`)
          .send({
            name: "group/1",
            description: "description",
          })
          .expect(403);
      });

      it("accepts manager requests", async () => {
        return request(app)
          .post("/groups/create")
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .send({
            name: "group/1",
            description: "description",
          })
          .expect(201);
      });
    });

    describe("validation", () => {
      it("rejects duplicate group names", async () => {
        await request(app)
          .post("/groups/create")
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .send({
            name: "group/1",
            description: "description",
          })
          .expect(201);

        return request(app)
          .post("/groups/create")
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .send({
            name: "group/1",
            description: "description",
          })
          .expect(409);
      });

      it("rejects empty names", async () => {
        return request(app)
          .post("/groups/create")
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .send({
            name: "",
            description: "description",
          })
          .expect(400);
      });

      it("accepts empty descriptions", async () => {
        return request(app)
          .post("/groups/create")
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .send({
            name: "group/1",
            description: "",
          })
          .expect(201);
      });

      it("rejects non string name or description", async () => {
        return request(app)
          .post("/groups/create")
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .send({
            name: 1,
            description: "description",
          })
          .expect(400);
      });
    });

    describe("image file handling", () => {
      it("uploads image file", async () => {
        // keeps file extension
        // saves file contents correctly
        // fileURL is only filename, no path
        const fileContents = "file contents";
        const fileName = "file.png";
        const file = {
          buffer: Buffer.from(fileContents),
          originalname: fileName,
          encoding: "utf-8",
          mimetype: "image/png",
        } as Express.Multer.File;

        await request(app)
          .post("/groups/create")
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .attach("image", file.buffer, file.originalname)
          .field("name", "group/1")
          .field("description", "description")
          .expect(201)
          .then((res) => {
            expect(res.body.imageURL).toMatch(/\d+\.png/);
            expect(res.body.imageURL).not.toMatch(/http/);
          });
      });
    });
  });

  describe("delete group endpoint", () => {
    describe("authentication", () => {
      it("rejects unauthenticated request", async () => {
        return request(app).delete(`/groups/${group.id}`).send().expect(401);
      });

      it("rejects non-manager request", async () => {
        return request(app)
          .delete(`/groups/${group.id}`)
          .set("Authorization", `Bearer ${regularAccessToken}`)
          .send()
          .expect(403);
      });

      it("accepts manager request", async () => {
        return request(app)
          .delete(`/groups/${group.id}`)
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .send()
          .expect(200);
      });
    });

    describe("validation", () => {
      it("does nothing on bad id", async () => {
        return request(app)
          .delete(`/groups/bad-id`)
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .send()
          .expect(200);
      });

      it("works on good id", async () => {
        await request(app)
          .delete(`/groups/${group.id}`)
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .send()
          .expect(200);
      });
    });
  });

  describe("update group endpoint", () => {
    describe("autentication", () => {
      it("rejects unauthenticated requests", async () => {
        return request(app)
          .post(`/groups/update/${group.id}`)
          .send({
            name: "group/1",
            description: "description",
          })
          .expect(401);
      });

      it("rejects requests from non-managers", async () => {
        return request(app)
          .post(`/groups/update/${group.id}`)
          .set("Authorization", `Bearer ${regularAccessToken}`)
          .send({
            name: "group/1",
            description: "description",
          })
          .expect(403);
      });

      it("accepts manager requests", async () => {
        return request(app)
          .post(`/groups/update/${group.id}`)
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .send({
            name: "group-updated",
            description: "description-updated",
          })
          .expect(200);
      });
    });

    describe("validation", () => {
      it("rejects non existing group update", async () => {
        return request(app)
          .post(`/groups/update/sombad-id`)
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .send({
            name: "group-updated",
            description: "description-updated",
          })
          .expect(404);
      });

      it("accepts update without image", async () => {
        return request(app)
          .post(`/groups/update/${group.id}`)
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .send({
            name: "group-updated",
            description: "description-updated",
          })
          .expect(200);
      });
    });

    describe("image file handling", () => {
      it("uploads image file", async () => {
        // keeps file extension
        // saves file contents correctly
        // fileURL is only filename, no path
        const fileContents = "file contents";
        const fileName = "file.png";
        const file = {
          buffer: Buffer.from(fileContents),
          originalname: fileName,
          encoding: "utf-8",
          mimetype: "image/png",
        } as Express.Multer.File;

        await request(app)
          .post(`/groups/update/${group.id}`)
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .attach("image", file.buffer, file.originalname)
          .field("name", "group/1")
          .field("description", "description")
          .expect(200)
          .then((res) => {
            expect(res.body.imageURL).toMatch(/\d+\.png/);
            expect(res.body.imageURL).not.toMatch(/http/);
          });
      });
    });
  });
});
