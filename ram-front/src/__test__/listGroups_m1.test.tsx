import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ListGroups from "../components/groups/ListGroup";

describe("ListGroups", () => {
  it("renders a list of groups", () => {
    render(
      <ListGroups
        groups={[
          {
            id: "fdsf-fdsfsf",
            name: "Group 1",
            progress: 50,
          },
          {
            id: "fdsf-fdsfsf-fddfs",
            name: "Group 2",
            progress: 80,
          },
        ]}
      />,
    );
    const groups = screen.getAllByRole("group");
    expect(groups).toHaveLength(2);
  });
});
