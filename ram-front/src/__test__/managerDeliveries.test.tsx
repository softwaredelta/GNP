// (c) Delta Software 2023, rights reserved.
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserDeliveriesTable } from "../components/deliverables/UserDeliveriesTable";
import { RecoilRoot } from "recoil";

describe("Manager deliveries card", () => {
  it("renders all the pending deliveries", () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <UserDeliveriesTable
            userDeliveries={[
              {
                fileUrl: "https://picsum.photos/100",
                dateDelivery: "10-10-2021",
                user: {
                  id: "test-user",
                  email: "test-email-1",
                  name: "test-name-1",
                  lastName: "test-lastname-1",
                  imageUrl: "https://picsum.photos/100",
                },
                status: "Sin enviar",
                delivery: {
                  id: "1",
                  deliveryName: "test-delivery-1",
                  description: "test-delivery-1",
                  imageUrl: "https://picsum.photos/100",
                },
                deliveryId: "test-delivery-id",
              },
            ]}
            onUpdate={() => window.location.reload()}
          />
        </BrowserRouter>
      </RecoilRoot>,
    );

    const user = screen.getByText("test-email-1");
    expect(user).toBeInTheDocument();

    const status = screen.getByText("Sin enviar");
    expect(status).toBeInTheDocument();

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
  });

  it("renders all the reviewed deliveries", () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <UserDeliveriesTable
            userDeliveries={[
              {
                fileUrl: "https://picsum.photos/100",
                dateDelivery: "10-10-2021",
                user: {
                  id: "test-user",
                  email: "test-email-2",
                  name: "test-name-2",
                  lastName: "test-lastname-2",
                  imageUrl: "https://picsum.photos/100",
                },
                status: "Aceptado",
                delivery: {
                  id: "1",
                  deliveryName: "test-delivery-1",
                  description: "test-delivery-1",
                  imageUrl: "https://picsum.photos/100",
                },
                deliveryId: "test-delivery-id",
              },
            ]}
            onUpdate={() => window.location.reload()}
          />
        </BrowserRouter>
      </RecoilRoot>,
    );
    const user = screen.getByText("test-email-2");
    expect(user).toBeInTheDocument();

    const status = screen.getByText("Aceptado");
    expect(status).toBeInTheDocument();

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
  });
});
