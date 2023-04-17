// (c) Delta Software 2023, rights reserved.

import { Root, createRoot } from "react-dom/client";
import { act, waitFor } from "@testing-library/react";
import { AppRouter } from "../pages";
import { RenderTest } from "./fixtures";
import { LOCAL_STORAGE_REFRESK_TOKEN_KEY } from "../lib/api/api-auth";

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

    it("handles bad credentials", async () => {
      const test = new RenderTest("authentication-2", <AppRouter />, root);
      await test.start();

      await waitFor(() => {
        expect(document.location.pathname).toBe("/login");
        expect(test.authentication).not.toBeNull();
        expect(test.authentication.isAuthenticated).toBe(false);
      });

      act(() => {
        test.authentication.authenticate({
          username: "test",
          password: "error",
        });
      });

      await waitFor(() => {
        expect(document.location.pathname).toBe("/login");
        expect(test.authentication).not.toBeNull();
        expect(test.authentication.isAuthenticated).toBe(false);
      });
    });
  });

  describe("when user is authenticated", () => {
    it("handles logout correctly", async () => {
      const test = new RenderTest("authentication-3", <AppRouter />, root);
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

      act(() => {
        test.authentication.logout();
      });

      await waitFor(() => {
        expect(document.location.pathname).toBe("/login");
        expect(test.authentication).not.toBeNull();
        expect(test.authentication.isAuthenticated).toBe(false);
      });
    });
  });

  describe("when local storage has refresh token", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("authenticates with valid token", async () => {
      localStorage.setItem(
        LOCAL_STORAGE_REFRESK_TOKEN_KEY,
        "valid-refresh-token",
      );

      const test = new RenderTest("authentication-4", <AppRouter />, root);
      await test.start();

      await waitFor(() => {
        expect(document.location.pathname).toBe("/");
        expect(test.authentication).not.toBeNull();
        expect(test.authentication.isAuthenticated).toBe(true);
        expect(test.authentication.hasError).toBe(false);
      });
    });

    it("clears expired refresh tokens", async () => {
      localStorage.setItem(
        LOCAL_STORAGE_REFRESK_TOKEN_KEY,
        "invalid-refresh-token",
      );

      const test = new RenderTest("authentication-5", <AppRouter />, root);
      await test.start();

      await waitFor(() => {
        expect(document.location.pathname).toBe("/login");
        expect(test.authentication).not.toBeNull();
        expect(test.authentication.isAuthenticated).toBe(false);
        expect(test.authentication.hasError).toBe(false);
        expect(
          localStorage.getItem(LOCAL_STORAGE_REFRESK_TOKEN_KEY),
        ).toBeNull();
      });
    });
  });
});
