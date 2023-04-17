// (c) Delta Software 2023, rights reserved.

import { Root, createRoot } from "react-dom/client";
import { act, waitFor } from "@testing-library/react";
import { AppRouter } from "../pages";
import { RenderTest } from "./fixtures";

describe("authentication", () => {
  let container: HTMLDivElement;
  let root: Root;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    root = createRoot(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });

  describe("when not logged in", () => {
    it("redirects to login", async () => {
      const test = new RenderTest("authentication-0", <AppRouter />, root);
      await test.start();

      await waitFor(() => {
        expect(document.location.pathname).toBe("/login");
        expect(test.authentication).not.toBeNull();
        expect(test.authentication.isAuthenticated).toBe(false);
      });
    });
  });

  describe("when user authenticates", () => {
    it("redirects to home on success", async () => {
      const test = new RenderTest("authentication-1", <AppRouter />, root);
      await test.start();

      await waitFor(() => {
        expect(document.location.pathname).toBe("/login");
        expect(test.authentication).not.toBeNull();
        expect(test.authentication.isAuthenticated).toBe(false);
      });

      act(() => {
        test.authentication.authenticate({
          username: "test",
          password: "test",
        });
      });

      await waitFor(() => {
        expect(document.location.pathname).toBe("/");
        expect(test.authentication).not.toBeNull();
        expect(test.authentication.isAuthenticated).toBe(true);
      });
    });
  });
});
