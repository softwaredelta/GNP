// (c) Delta Software 2023, rights reserved.

import "@testing-library/jest-dom/extend-expect";
import SalesHistory from "../pages/SalesHistory";
import { Root, createRoot } from "react-dom/client";
import { RenderTest } from "./fixtures";
import { screen, waitFor } from "@testing-library/dom";

describe("SalesHistory", () => {
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

  it("renders correctly", async () => {
    const test = new RenderTest("sales-history-0", <SalesHistory />, root);
    await test.start();

    await waitFor(async () => {
      expect(screen.getByTestId("sales-table")).toBeInTheDocument();

      const client1 = "Test client name 1";
      const client2 = "Test client name 2";
      expect(screen.getByText(client1)).toBeInTheDocument();
      expect(screen.getByText(client2)).toBeInTheDocument();
    });
  });
});
