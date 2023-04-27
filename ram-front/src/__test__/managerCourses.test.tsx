// (c) Delta Software 2023, rights reserved.
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ListManagerGroup from "../components/groups/ListManagerGroup";

describe("Manager courses card", () => {
  it("renders all the groups", () => {
    render(
      <BrowserRouter>
        <ListManagerGroup
          groups={[
            {
              id: "1",
              name: "test-group-1",
              imageURL: "https://picsum.photos/100",
              groupUsers: [
                {
                  status: "active",
                  userId: "test-user",
                  groupId: "1",
                },
              ],
            },
            {
              id: "2",
              name: "test-group-2",
              imageURL: "https://picsum.photos/500",
              groupUsers: [
                {
                  status: "active",
                  userId: "test-user2",
                  groupId: "2",
                },
                {
                  status: "active",
                  userId: "test-user3",
                  groupId: "2",
                },
              ],
            },
          ]}
        ></ListManagerGroup>
      </BrowserRouter>,
    );

    const group1 = screen.getByText(/test-group-1/i);
    expect(group1).toBeInTheDocument();

    const group2 = screen.getByText(/test-group-2/i);
    expect(group2).toBeInTheDocument();
  });

  it("renders a message when there are no groups", () => {
    render(
      <BrowserRouter>
        <ListManagerGroup groups={[]}></ListManagerGroup>
      </BrowserRouter>,
    );
    const message = screen.getByText("No hay grupos registrados");
    expect(message).toBeInTheDocument();
  });

  it("renders a group", () => {
    render(
      <BrowserRouter>
        <ListManagerGroup
          groups={[
            {
              id: "1",
              name: "test-group-1",
              imageURL:
                "https://ahorraseguros.mx/wp-content/uploads/2021/04/banner-gnp.jpeg",
              groupUsers: [
                {
                  status: "active",
                  userId: "test-user",
                  groupId: "1",
                },
              ],
            },
          ]}
        ></ListManagerGroup>
      </BrowserRouter>,
    );

    const name = screen.getByText("test-group-1");
    expect(name).toBeInTheDocument();

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
  });
});
