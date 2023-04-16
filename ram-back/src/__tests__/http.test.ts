// (c) Delta Software 2023, rights reserved.

import request from "supertest";
import { app } from "../controller";

describe("HTTP", () => {
  it("Should have an http server", () => {
    return request(app)
      .get("/health")
      .expect("Content-Type", /text\/html/)
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("OK");
      });
  });
});
