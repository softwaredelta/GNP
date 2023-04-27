// (c) Delta Software 2023, rights reserved.
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ListManagerGroup from "../components/groups/ListManagerGroup";
import ListManagerDeliveries from "../components/deliverables/ListManagerDeliveries";

describe("Manager deliveries card", () => {
  it("renders all the deliveries", () => {
    render(
      <BrowserRouter>
        <ListManagerDeliveries
          groupDeliveries={[
            {
              id: "1",
              description: "test-delivery-1",
              imageUrl: "https://picsum.photos/100",
              groupId: "1",
              userDeliveries: [
                {
                  id: "1",
                  description: "test-user-delivery-1",
                  imageURL: "https://picsum.photos/100",
                },
              ],
            },
            {
              id: "2",
              description: "test-delivery-2",
              imageUrl: "https://picsum.photos/100",
              groupId: "1",
              userDeliveries: [
                {
                  id: "2",
                  description: "test-user-delivery-2",
                  imageURL: "https://picsum.photos/100",
                },
              ],
            },
          ]}
        ></ListManagerDeliveries>
      </BrowserRouter>,
    );

    const delivery1 = screen.getByText(/test-delivery-1/i);
    expect(delivery1).toBeInTheDocument();

    const delivery2 = screen.getByText(/test-delivery-2/i);
    expect(delivery2).toBeInTheDocument();
  });

  it("renders a message when there are no deliveries", () => {
    render(
      <BrowserRouter>
        <ListManagerDeliveries groupDeliveries={[]}></ListManagerDeliveries>
      </BrowserRouter>,
    );
    const message = screen.getByText("No hay entregas para este grupo");
    expect(message).toBeInTheDocument();
  });

  it("renders a delivery", () => {
    render(
      <BrowserRouter>
        <ListManagerDeliveries
          groupDeliveries={[
            {
              id: "1",
              description: "test-delivery-1",
              imageUrl: "https://picsum.photos/200",
              groupId: "1",
              userDeliveries: [
                {
                  id: "1",
                  description: "test-user-delivery-1",
                  imageURL: "https://picsum.photos/100",
                },
              ],
            },
          ]}
        ></ListManagerDeliveries>
      </BrowserRouter>,
    );

    const name = screen.getByText("test-delivery-1");
    expect(name).toBeInTheDocument();

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
  });
});
