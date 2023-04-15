// (c) Delta Software 2023, rights reserved.

import { waitFor } from "@testing-library/react";
import { AppRouter } from "../pages/AppRouter";
import { testRender } from "./fixture";
import { auth$ } from "../lib/auth/auth";

describe("AuthenticationRouting", () => {
  let container: HTMLDivElement;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });

  describe("when not authenticated", () => {
    it("redirects to login", async () => {
      testRender(container, <AppRouter />);
      await waitFor(() => {
        expect(document.location.pathname).toBe("/login");
      });
    });
  });

  describe("when authenticated", () => {
    it("redirects to home", async () => {
      testRender(container, <AppRouter />, (ss) => {
        ss.set(auth$, { username: "test", accessToken: "test" });
      });
      await waitFor(() => {
        expect(document.location.pathname).toBe("/");
      });
    });
  });
});
