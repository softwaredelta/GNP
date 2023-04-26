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
            deliveryId: "1",
            deliveryName: "Delivery 1",
            description: "Description of Delivery 1",
            fileUrl: "https://www.google.com",
            groupName: "Group 1",
            imageUrl: "",
            status: "Sin enviar",
          },
          {
            dateDelivery: "2023-12-05",
            deliveryId: "2",
            deliveryName: "Delivery 2",
            description: "Description of Delivery 2",
            fileUrl: "https://www.google.com",
            groupName: "Group 1",
            imageUrl: "",
            status: "Sin enviar",
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
