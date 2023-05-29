// (c) Delta Software 2023, rights reserved.
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { VerifySalesTable } from "../components/sales/VerifySalesTable";
import { RecoilRoot } from "recoil";

describe("Verify sales table", () => {
  const date = new Date();

  it("render a sale to be check", () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <VerifySalesTable
            sales={[
              {
                id: "test-sale4",
                policyNumber: "423456789",
                paidDate: date,
                status: "sin revisar",
                yearlyFee: "100000",
                contractingClient: "Mónica Ayala",
                periodicity: "mensual",
                evidenceUrl: "https://www.google.com",
                insuredCostumer: "Jordana Betancourt",
                assuranceTypeId: "test-at-1",
                user: {
                  email: "test@delta.tec.mx",
                  name: "Oliver",
                  lastName: "Queen",
                  id: "test-user",
                },
                assuranceType: {
                  id: "test-at-1",
                  name: "test-assurance-type-1",
                  description: "test-assurance-type-1-description",
                },
              },
            ]}
            onUpdated={() => {}}
          ></VerifySalesTable>
        </BrowserRouter>
      </RecoilRoot>,
    );

    const client = screen.getByText(/Mónica Ayala/i);
    expect(client).toBeInTheDocument();

    const policy = screen.getByText(/423456789/i);
    expect(policy).toBeInTheDocument();

    const status = screen.getByText(/sin revisar/i);
    expect(status).toBeInTheDocument();

    const assurance = screen.getByText(/test-assurance-type-1/i);
    expect(assurance).toBeInTheDocument();
  });
});
