// (c) Delta Software 2023, rights reserved.
import "@testing-library/jest-dom/extend-expect";
import { Root, createRoot } from "react-dom/client";
import { RenderTest } from "./fixtures";
import { screen } from "@testing-library/react";
import SearchDeliveryTable from "../components/tables/SearchDeliveryTable";

describe("New Search Delivery Table", () => {
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
  describe("renders a message when there are no agents", () => {
    it("redirects to login", async () => {
      const test = new RenderTest(
        "authentication-0",
        <SearchDeliveryTable deliveries={[]} />,
        root,
      );
      await test.start();

      const message = screen.getByText("No hay entregables en el grupo");
      expect(message).toBeInTheDocument();
    });
  });

  describe("renders a delivery correctly", () => {
    it("redirects to login", async () => {
      const test = new RenderTest(
        "authentication-0",
        (
          <SearchDeliveryTable
            deliveries={[
              {
                id: "1",
                deliveryName: "Entregable 1",
                description: "Nel",
                imageUrl:
                  "https://www.kayum.mx/wp-content/uploads/2019/09/logo-GNP.jpeg",
              },
            ]}
          />
        ),
        root,
      );
      await test.start();

      const delivery = screen.getByText("Entregable 1");
      expect(delivery).toBeInTheDocument();
    });
  });
});
