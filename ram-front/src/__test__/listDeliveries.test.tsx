// (c) Delta Software 2023, rights reserved.
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import ListDeliverables from "../components/deliverables/ListDeliverables";

describe("ListDeliveries", () => {
  it("should render list of deliveries successfully", () => {
    render(
      <ListDeliverables
        deliverables={[
          {
            dateDelivery: "2023-10-10",
            status: "Sin enviar",
            delivery: {
              deliveryName: "Delivery 1",
              description: "Description of Delivery 1",
              id: "1",
              imageURL: "",
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
              imageURL: "",
            },
          },
          {
            dateDelivery: "2023-10-10",
            status: "Sin enviar",
            delivery: {
              deliveryName: "Delivery 2",
              description: "Description of Delivery 2",
              id: "2",
              imageURL: "",
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
              email: "user-2@mail.com",
              id: "2",
              imageURL: "",
            },
          },
        ]}
      />,
    );

    const deliveries = screen.getAllByRole("delivery");
    expect(deliveries).toHaveLength(2);
  });

  it("should render a message when there are no deliveries", () => {
    render(<ListDeliverables deliverables={[]} />);
    const message = screen.getByText("No hay entregables");
    expect(message).toBeInTheDocument();
  });
});
