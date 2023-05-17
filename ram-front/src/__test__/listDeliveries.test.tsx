// (c) Delta Software 2023, rights reserved.
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import ListDeliverables from "../components/deliverables/ListDeliverables";

describe("ListDeliveries", () => {
  it("should render list of deliveries successfully", () => {
    render(
      <RecoilRoot>
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
                imageURL: "",
                name: "Group 1",
                progress: 0,
                userDeliveries: [],
              },
              user: {
                email: "user@mail.com",
                id: "1",
                name: "User",
                lastName: "User",
                imageURL: "",
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
                imageURL: "",
                name: "Group 2",
                progress: 0,
                userDeliveries: [],
              },
              user: {
                id: "2",
                email: "user-2@mail.com",
                name: "User 2",
                lastName: "User 2",
                imageURL: "",
              },
            },
          ]}
        />
      </RecoilRoot>,
    );

    // const deliveries = screen.getAllByText(/Delivery/i);
    // expect(deliveries).toHaveLength(2);
  });

  it("should render a message when there are no deliveries", () => {
    render(
      <RecoilRoot>
        <ListDeliverables deliverables={[]} />
      </RecoilRoot>,
    );
    const message = screen.getByText("No hay entregables");
    expect(message).toBeInTheDocument();
  });
});
