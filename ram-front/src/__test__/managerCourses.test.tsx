// (c) Delta Software 2023, rights reserved.
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ManagerListGroups } from "../components/groups/ManagerListGroups";
import Groups from "../pages/Groups";

describe("Manager courses card", () => {
  it("renders all the groups", () => {
    render(
      <BrowserRouter>
        <ManagerListGroups
          groups={[
            {
              id: "1",
              name: "test-group-1",
              description: "test-delivery-1",
              progress: 0,
              imageURL: "https://picsum.photos/100",
              groupUsers: [
                {
                  email: "test-user1",
                  id: "1",
                  imageURL: "",
                },
              ],
            },
            {
              id: "2",
              name: "test-group-2",
              description: "test-delivery-2",
              progress: 0,
              imageURL: "https://picsum.photos/100",
              groupUsers: [
                {
                  email: "test-user2",
                  id: "2",
                  imageURL: "",
                },
              ],
            },
          ]}
        ></ManagerListGroups>
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
        <ManagerListGroups groups={[]}></ManagerListGroups>
      </BrowserRouter>,
    );
    const message = screen.getByText("No hay grupos registrados");
    expect(message).toBeInTheDocument();
  });

  it("renders a group", () => {
    render(
      <BrowserRouter>
        <ManagerListGroups
          groups={[
            {
              id: "1",
              name: "test-group-1",
              description: "test-delivery-1",
              progress: 0,
              imageURL: "https://picsum.photos/100",
              groupUsers: [
                {
                  email: "test-user1",
                  id: "1",
                  imageURL: "",
                },
              ],
            },
          ]}
        ></ManagerListGroups>
      </BrowserRouter>,
    );

    const name = screen.getByText("test-group-1");
    expect(name).toBeInTheDocument();

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
  });
});

describe("Add new group", () => {
  it("renders add new group modal", () => {
    render(<Groups />);

    const button = screen.getByText("Agregar");

    expect(screen.getByText("Agregar grupo")).toBeNull();

    fireEvent.click(button);

    expect(screen.getByText("Agregar grupo")).toBeInTheDocument();
  });
});
