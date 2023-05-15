// (c) Delta Software 2023, rights reserved.

import "@testing-library/jest-dom/extend-expect";
import FunnelProspects from "../pages/ProspectsFunnel";
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
    const test = new RenderTest("funnel-prospect-0", <FunnelProspects />, root);
    await test.start();

    await waitFor(async () => {
      expect(screen.getByTestId("funnel-table")).toBeInTheDocument();

      const agent1 = "Test Agent 1";
      const agent2 = "Test Agent 2";
      expect(screen.getByText(agent1)).toBeInTheDocument();
      expect(screen.getByText(agent2)).toBeInTheDocument();
    });
  });
});
