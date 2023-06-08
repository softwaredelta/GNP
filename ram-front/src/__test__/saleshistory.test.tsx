// (c) Delta Software 2023, rights reserved.

import "@testing-library/jest-dom/extend-expect";
import { Root, createRoot } from "react-dom/client";
import { RenderTest } from "./fixtures";
import { screen } from "@testing-library/dom";
import { SalesTable } from "../components/sales/SalesTable";

describe("SalesHistory", () => {
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

  it("renders correctly", async () => {
    const test = new RenderTest(
      "sales-history-0",
      (
        <SalesTable
          sales={[
            {
              id: "1",
              policyNumber: "1",
              yearlyFee: "12000",
              contractingClient: "Jordana",
              status: "Aceptada",
              periodicity: "Mensual",
              insuredCostumer: "Juan Carlos",
              assuranceTypeId: "1",
            },
          ]}
          updateSales={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      ),
      root,
    );
    await test.start();

    const contractingClient = "Jordana";
    const periodicity = "Mensual";
    expect(screen.getByText(contractingClient)).toBeInTheDocument();
    expect(screen.getByText(periodicity)).toBeInTheDocument();
  });
});
