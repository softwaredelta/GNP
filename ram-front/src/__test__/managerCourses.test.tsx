// (c) Delta Software 2023, rights reserved.

import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Root, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import ModalGroupForm from "../components/forms/ModalGroupForm";
import { ManagerListGroups } from "../components/groups/ManagerListGroups";
import ManagerCourses from "../pages/ManagerGroups";
import { RenderTest } from "./fixtures";

describe("Manager courses card", () => {
  it("renders all the groups", () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <ManagerListGroups
            onUpdated={() => {}}
            groups={[
              {
                id: "1",
                name: "test-group-1",
                description: "test-delivery-1",
                progress: 0,
                imageUrl: "https://picsum.photos/100",
                groupUsers: [
                  {
                    email: "test-user1",
                    id: "1",
                    name: "test-user1",
                    lastName: "test-user1",
                    imageUrl: "",
                  },
                ],
              },
              {
                id: "2",
                name: "test-group-2",
                description: "test-delivery-2",
                progress: 0,
                imageUrl: "https://picsum.photos/100",
                groupUsers: [
                  {
                    email: "test-user2",
                    id: "2",
                    name: "test-user2",
                    lastName: "test-user2",
                    imageUrl: "",
                  },
                ],
              },
            ]}
          ></ManagerListGroups>
        </BrowserRouter>
        ,
      </RecoilRoot>,
    );

    const group1 = screen.getByText(/test-group-1/i);
    expect(group1).toBeInTheDocument();

    const group2 = screen.getByText(/test-group-2/i);
    expect(group2).toBeInTheDocument();
  });

  it("renders a message when there are no groups", () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <ManagerListGroups
            onUpdated={() => {}}
            groups={[]}
          ></ManagerListGroups>
        </BrowserRouter>
      </RecoilRoot>,
    );
    const message = screen.getByText("No hay grupos registrados");
    expect(message).toBeInTheDocument();
  });

  it("renders a group", () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <ManagerListGroups
            onUpdated={() => {}}
            groups={[
              {
                id: "1",
                name: "test-group-1",
                description: "test-delivery-1",
                progress: 0,
                imageUrl: "https://picsum.photos/100",
                groupUsers: [
                  {
                    email: "test-user1",
                    id: "1",
                    name: "test-user1",
                    lastName: "test-user1",
                    imageUrl: "",
                  },
                ],
              },
            ]}
          ></ManagerListGroups>
        </BrowserRouter>
      </RecoilRoot>,
    );

    const name = screen.getByText("test-group-1");
    expect(name).toBeInTheDocument();

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
  });
});

describe("Add new group", () => {
  let root: Root;
  let container: HTMLDivElement;
  beforeEach(() => {
    container = document.createElement("div");
    const portal = document.createElement("div");

    portal.setAttribute("id", "modal-root");
    document.body.appendChild(container);
    document.body.appendChild(portal);

    root = createRoot(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });

  it("renders add new group button", async () => {
    const test = new RenderTest("not-open-modal", <ManagerCourses />, root);
    await test.start();

    await waitFor(() => {
      const addButton = screen.getByText("Agregar");
      expect(addButton).toBeInTheDocument();
    });
  });

  it("renders add group modal", async () => {
    const mockPostHandler = jest.fn();
    const mockToggleHandler = jest.fn();

    const test = new RenderTest(
      "add-group-modal",
      (
        <ModalGroupForm
          handlePost={mockPostHandler}
          isOpenModal={true}
          closeModal={mockToggleHandler}
          isEditModal={false}
        />
      ),
      root,
    );
    await test.start();

    const buttonClose = screen.getByText("Cancelar");
    expect(buttonClose).toBeInTheDocument();

    fireEvent.click(buttonClose);

    expect(mockToggleHandler).toBeCalled();
  });
});
