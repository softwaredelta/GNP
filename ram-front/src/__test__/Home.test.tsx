// (c) Delta Software 2023, rights reserved.

import { testRender } from "./fixture";
import { Home } from "../pages/Home";
import { screen, waitFor } from "@testing-library/react";
import { auth$ } from "../lib/auth/auth";

describe("Home", () => {
  let container: HTMLDivElement;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });

  describe("when authenticated", () => {
    it("renders correctly", () => {
      testRender(container, <Home />, (state) => {
        state.set(auth$, { username: "test", accessToken: "test" });
      });

      waitFor(() => {
        expect(screen.getByText("Home")).toBeInTheDocument();
      });
    });
  });
});
