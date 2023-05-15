// (c) Delta Software 2023, rights reserved.

import { Root, createRoot } from "react-dom/client";
import "@testing-library/jest-dom/extend-expect";
import { screen, render, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ManagerListGroups } from "../components/groups/ManagerListGroups";
import { RenderTest } from "./fixtures";
import ManagerCourses from "../pages/ManagerGroups";
import { RecoilRoot } from "recoil";

describe("Manager courses card", () => {
  it("renders all the groups", () => {
    render(
      <RecoilRoot>
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
                    name: "test-user1",
                    lastName: "test-user1",
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
                    name: "test-user2",
                    lastName: "test-user2",
                    imageURL: "",
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
          <ManagerListGroups groups={[]}></ManagerListGroups>
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
                    name: "test-user1",
                    lastName: "test-user1",
                    imageURL: "",
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
    document.body.appendChild(container);

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
    const test = new RenderTest("open-modal", <ManagerCourses />, root);
    await test.start();

    let addButton: Element | null = null;
    await waitFor(() => {
      addButton = screen.getByText("Agregar");
      expect(addButton).not.toBeNull();
    });

    act(() => {
      addButton?.dispatchEvent(new MouseEvent("click"));
    });

    await waitFor(() => {
      const modal = screen.getByTestId("modal-group");
      expect(modal).toBeDefined();
    });
  });
});
