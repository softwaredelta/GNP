// (c) Delta Software 2023, rights reserved.
import "@testing-library/jest-dom/extend-expect";
import ImageURL from "../components/Image";
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

  it("Shows image correctly", async () => {
    const test = new RenderTest(
      "ImageURL-0",
      (
        <ImageURL url="https://c.files.bbci.co.uk/48DD/production/_107435681_perro1.jpg" />
      ),
      root,
    );
    await test.start();
    const image = screen.getByRole("img");
    const expectedUrl =
      "http://test.dev/files?fileUrl=https%3A%2F%2Fc.files.bbci.co.uk%2F48DD%2Fproduction%2F_107435681_perro1.jpg";
    expect(image).toHaveAttribute("src", expectedUrl);
  });
});
