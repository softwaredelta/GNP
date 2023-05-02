// (c) Delta Software 2023, rights reserved.
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import ListGroups from "../components/groups/ListGroup";
import { BrowserRouter } from "react-router-dom";

describe("ListGroups", () => {
  it("renders a list of groups", () => {
    render(
      <BrowserRouter>
        <ListGroups
          groups={[
            {
              id: "fdsf-fdsfsf",
              name: "Group 1",
              progress: 50,
              description: "test-delivery-1",
              imageURL: "https://picsum.photos/200",
            },
            {
              id: "fdsf-fdsfsf-fddfs",
              name: "Group 2",
              progress: 80,
              description: "test-delivery-2",
              imageURL: "https://picsum.photos/200",
            },
          ]}
        />
      </BrowserRouter>,
    );
    const groups = screen.getAllByRole("group");
    expect(groups).toHaveLength(2);
  });

  it("renders a message when there are no groups", () => {
    render(
      <BrowserRouter>
        <ListGroups groups={[]} />
      </BrowserRouter>,
    );
    const message = screen.getByText("No hay grupos");
    expect(message).toBeInTheDocument();
  });

  it("renders a group", () => {
    render(
      <BrowserRouter>
        <ListGroups
          groups={[
            {
              id: "fdsf-fdsfsf",
              name: "Group 1",
              progress: 50,
              description: "test-delivery-1",
              imageURL: "https://picsum.photos/200",
            },
          ]}
        />
      </BrowserRouter>,
    );
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
