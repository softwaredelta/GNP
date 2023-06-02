// (c) Delta Software 2023, rights reserved.

import "@testing-library/jest-dom/extend-expect";
import NewSale from "../pages/NewSale";
import { Root, createRoot } from "react-dom/client";
import { RenderTest } from "./fixtures";

describe("NewSale", () => {
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
    const test = new RenderTest("Render the sale form", <NewSale />, root);
    await test.start();
  });
});
