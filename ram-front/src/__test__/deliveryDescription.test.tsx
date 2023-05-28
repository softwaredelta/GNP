// (c) Delta Software 2023, rights reserved.
import "@testing-library/jest-dom/extend-expect";
import DeliveryDescription from "../components/deliverables/DeliveryDescription";
import { screen } from "@testing-library/react";
import { Root, createRoot } from "react-dom/client";
import { RenderTest } from "./fixtures";

describe("Delivery description", () => {
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

  it("Shows description correctly", async () => {
    const test = new RenderTest(
      "description-0",
      <DeliveryDescription description="This is a test description" />,
      root,
    );
    await test.start();
    const descri = screen.getByText("This is a test description");
    expect(descri).toBeInTheDocument();
  });
});
