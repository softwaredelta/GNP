// (c) Delta Software 2023, rights reserved.

import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/react";
import LinkDelivery from "../components/deliverables/LinkDelivery";
import { Root, createRoot } from "react-dom/client";
import { RenderTest } from "./fixtures";

describe("Links Delivery", () => {
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

  it("Shows links correctly", async () => {
    const test = new RenderTest(
      "list-links-0",
      (
        <LinkDelivery
          links={[
            {
              id: "fdsf-fdsfsf",
              link: "https://www.google.com",
              name: "Google",
            },
            {
              id: "holisholis",
              link: "https://www.youtube.com",
              name: "Youtube",
            },
          ]}
        />
      ),
      root,
    );
    await test.start();
    const name1 = screen.getByText("Google");
    expect(name1).toBeInTheDocument();
    const name2 = screen.getByText("Youtube");
    expect(name2).toBeInTheDocument();
  });
});
