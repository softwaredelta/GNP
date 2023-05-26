// (c) Delta Software 2023, rights reserved.
import "@testing-library/jest-dom/extend-expect";
import ListDeliverables from "../components/deliverables/ListDeliverables";
import { Root, createRoot } from "react-dom/client";
import { RenderTest } from "./fixtures";
import { screen } from "@testing-library/react";

describe("ListDeliveries", () => {
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

  it("should render list of deliveries successfully", async () => {
    const test = new RenderTest(
      "list-deliveries-0",
      (
        <ListDeliverables
          deliverables={[
            {
              dateDelivery: "2023-10-10",
              deliveryId: "1",
              status: "Sin enviar",
              delivery: {
                deliveryName: "Delivery 1",
                description: "Description of Delivery 1",
                id: "1",
                imageUrl: "",
                userDeliveries: [],
              },
              fileUrl: "https://www.google.com",
              group: {
                id: "1",
                deliveries: [],
                description: "Description of Group 1",
                groupUsers: [],
                imageUrl: "",
                name: "Group 1",
                progress: 0,
                userDeliveries: [],
              },
              user: {
                email: "user@mail.com",
                id: "1",
                name: "User",
                lastName: "User",
                imageUrl: "",
              },
            },
            {
              dateDelivery: "2023-10-10",
              deliveryId: "2",
              status: "Sin enviar",
              delivery: {
                deliveryName: "Delivery 2",
                description: "Description of Delivery 2",
                id: "2",
                imageUrl: "",
                userDeliveries: [],
              },
              fileUrl: "https://www.google.com",
              group: {
                id: "2",
                deliveries: [],
                description: "Description of Group 2",
                groupUsers: [],
                imageUrl: "",
                name: "Group 2",
                progress: 0,
                userDeliveries: [],
              },
              user: {
                email: "user-2@mail.com",
                id: "2",
                name: "User 2",
                lastName: "User 2",
                imageUrl: "",
              },
            },
          ]}
        />
      ),
      root,
    );
    await test.start();
    const name1 = screen.getByText("Delivery 1");
    expect(name1).toBeInTheDocument();
    const name2 = screen.getByText("Delivery 2");
    expect(name2).toBeInTheDocument();
  });

  it("should render a message when there are no deliveries", () => {
    const test = new RenderTest(
      "list-deliveries-0",
      <ListDeliverables deliverables={[]} />,
      root,
    );
    test.start();
    const message = screen.getByText("No hay entregables");
    expect(message).toBeInTheDocument();
  });
});
