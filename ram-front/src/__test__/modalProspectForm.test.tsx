// (c) Delta Software 2023, rights reserved.

import "@testing-library/jest-dom/extend-expect";
import { screen, fireEvent } from "@testing-library/react";
import ModalProspectForm from "../components/forms/ModalProspectForm";
import { Root, createRoot } from "react-dom/client";
import { RenderTest } from "./fixtures";

describe("Tests Modal Prospect", () => {
  let container: HTMLDivElement;
  let root: Root;
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
  it("renders modal prospect", async () => {
    const mockPostHandler = jest.fn();
    const mockToggleHandler = jest.fn();

    const exampleListStatus = [
      {
        id: "1",
        name: "example1",
      },
      {
        id: "2",
        name: "example2",
      },
    ];

    const test = new RenderTest(
      "modal-prospect",
      (
        <ModalProspectForm
          closeModal={mockToggleHandler}
          handlePost={mockPostHandler}
          isOpenModal={true}
          isEdit={false}
          listStatus={exampleListStatus}
        />
      ),
      root,
    );
    await test.start();

    const title = screen.getByText("Agregar prospecto");
    expect(title).toBeInTheDocument();

    exampleListStatus.forEach((status) => {
      const statusName = screen.getByText(status.name);
      expect(statusName).toBeInTheDocument();
    });

    const buttonSave = screen.getByText("Guardar");
    expect(buttonSave).toBeInTheDocument();

    fireEvent.click(buttonSave);
    fireEvent.click(buttonSave);

    const buttonClose = screen.getByText("Cancelar");
    expect(buttonClose).toBeInTheDocument();

    fireEvent.click(buttonClose);

    expect(mockToggleHandler).toHaveBeenCalledTimes(1);
    expect(mockPostHandler).toHaveBeenCalledTimes(0);
  });
});
