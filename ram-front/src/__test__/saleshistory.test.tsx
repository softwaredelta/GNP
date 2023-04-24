// (c) Delta Software 2023, rights reserved.

import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import  SalesHistory from "../pages/SalesHistory";
import { RecoilRoot } from "recoil";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { SalesFilters } from "../components/SalesHistory/SalesFilters";

describe("SalesHistory", () => {
  let container: HTMLDivElement;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });

  it("renders correctly", async () => {
    act(() => {
      createRoot(container).render(
        <RecoilRoot>
          <Suspense>
            <SalesHistory />
          </Suspense>
        </RecoilRoot>,
      );
    });
  });

  it("renders pagination component", () => {
    render(<SalesHistory />);
    const paginationComponent = screen.getByTestId("Pagination");
    expect(paginationComponent).toBeInTheDocument();
  });

  it("renders sales table component", () => {
    render(<SalesHistory />);
    const tableComponent = screen.getByTestId("Table");
    expect(tableComponent).toBeInTheDocument();
  });

  it("renders filters component", () => {
    render(<SalesHistory />);
    const filtersComponent = screen.getByTestId("Filters");
    expect(filtersComponent).toBeInTheDocument();
  });

  it("updates client input filter on change", () => {
    render(<SalesFilters />);
    const clientInput: HTMLInputElement = screen.getByTestId("ClientInput");
    fireEvent.change(clientInput, { target: { value: "Kenny Vercamer" } });
    expect(clientInput.value).toBe("Kenny Vercamer");
  });

  it("updates policy number input filter on change", () => {
    render(<SalesFilters />);
    const policyNumInput: HTMLInputElement =
      screen.getByTestId("PolicyNumInput");
    fireEvent.change(policyNumInput, { target: { value: "1234567" } });
    expect(policyNumInput.value).toBe("1234567");
  });

  it("updates date input filter on change", () => {
    render(<SalesFilters />);
    const datePicker: HTMLInputElement = screen.getByLabelText("Fecha");
    fireEvent.change(datePicker, { target: { value: "18/04/2023" } });
    expect(datePicker.value).toBe("18/04/2023");
  });

  //   it("updates insurance type input filter on change", () => {
  //     render(<SalesFilters />);
  //   });

  //   it("pagination works on the table [wip]", () => {
  //     render(<SalesHistory />);
  //   });
});
