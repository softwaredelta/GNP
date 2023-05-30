// (c) Delta Software 2023, rights reserved.
import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/react";
import ListGroups from "../components/groups/ListGroup";
import { Root, createRoot } from "react-dom/client";
import { RenderTest } from "./fixtures";

describe("ListGroups", () => {
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

  it("renders a list of groups", async () => {
    const test = new RenderTest(
      "list-groups-0",
      (
        <ListGroups
          groups={[
            {
              id: "fdsf-fdsfsf",
              name: "Group 1",
              progress: 50,
              description: "test-delivery-1",
              imageUrl: "https://picsum.photos/200",
            },
            {
              id: "fdsf-fdsfsf-fddfs",
              name: "Group 2",
              progress: 80,
              description: "test-delivery-2",
              imageUrl: "https://picsum.photos/200",
            },
          ]}
        />
      ),
      root,
    );
    await test.start();

    const groups = screen.getAllByRole("group");
    expect(groups).toHaveLength(2);
  });

  it("renders a message when there are no groups", async () => {
    const test = new RenderTest(
      "list-groups-1",
      <ListGroups groups={[]} />,
      root,
    );
    await test.start();

    const message = screen.getByText("No hay grupos");
    expect(message).toBeInTheDocument();
  });

  it("renders a group", async () => {
    const test = new RenderTest(
      "list-groups-2",
      (
        <ListGroups
          groups={[
            {
              id: "fdsf-fdsfsf",
              name: "Group 1",
              progress: 50,
              description: "test-delivery-1",
              imageUrl: "https://picsum.photos/200",
            },
          ]}
        />
      ),
      root,
    );
    await test.start();

    const group = screen.getByRole("group");
    expect(group).toBeInTheDocument();

    const name = screen.getByText("Group 1");
    expect(name).toBeInTheDocument();

    const progress = screen.getByText("50%");
    expect(progress).toBeInTheDocument();

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
  });
});
