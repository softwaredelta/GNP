// (c) Delta Software 2023, rights reserved.

import { Root, createRoot } from "react-dom/client";
import { act, screen, waitFor } from "@testing-library/react";
import { AppRouter } from "../pages";
import { RenderTest } from "./fixtures";
import { LOCAL_STORAGE_REFRESK_TOKEN_KEY } from "../lib/api/api-auth";

function prepareLocalStorage(refreshToken: string) {
  localStorage.setItem(
    LOCAL_STORAGE_REFRESK_TOKEN_KEY,
    JSON.stringify({
      refreshToken,
      refreshTokenExpiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
    }),
  );
}

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
      prepareLocalStorage("valid-refresh-token");

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
      prepareLocalStorage("expired-refresh-token");

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

  describe("when authenticated and app attempts to refresh token", () => {
    it("refreshes token on success", async () => {
      const test = new RenderTest("authentication-6", <AppRouter />, root);
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

      const oldAccessToken = test.authentication.auth?.accessToken;

      act(() => {
        test.authentication.refresh();
      });

      await waitFor(() => {
        expect(document.location.pathname).toBe("/");
        expect(test.authentication).not.toBeNull();
        expect(test.authentication.isAuthenticated).toBe(true);
        expect(test.authentication.auth?.accessToken).not.toBe(oldAccessToken);
      });
    });
  });

  describe("logout button in navbar", () => {
    it("logs out", async () => {
      const test = new RenderTest("authentication-7", <AppRouter />, root);
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

      let logoutButton: Element | null = null;
      await waitFor(() => {
        expect(document.location.pathname).toBe("/");
        expect(test.authentication).not.toBeNull();
        expect(test.authentication.isAuthenticated).toBe(true);

        logoutButton = screen.getByTestId("logout-button");
        expect(logoutButton).not.toBeNull();
      });

      act(() => {
        logoutButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });

      await waitFor(() => {
        expect(document.location.pathname).toBe("/login");
        expect(test.authentication).not.toBeNull();
        expect(test.authentication.isAuthenticated).toBe(false);
      });
    });
  });
});
