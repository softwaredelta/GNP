// (c) Delta Software 2023, rights reserved.

import { render, screen, act, queryByAttribute } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { SalesHistory } from "../pages/SalesHistory";
import { RecoilRoot } from "recoil";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
// import { SalesTable } from "../components/SalesHistory/SalesTable";
// import { SalesFilters } from "../components/SalesHistory/SalesFilters";

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

  it("renders sales table component [wip]", () => {
    const getById = queryByAttribute.bind(null, "testid");
    const tableComponent = getById(container, "Table");
    expect(tableComponent).toBeInTheDocument();
  });

  it("renders filters component [wip]", () => {
    const getById = queryByAttribute.bind(null, "testid");
    const filtersComponent = getById(container, "Filters");
    expect(filtersComponent).toBeInTheDocument();
  });

  //   it("updates client input filter on change", () => {
  //     render(<SalesFilters/>);
  //   });

  //   it("updates client input filter on change", () => {
  //     render(<SalesFilters />);
  //   });

  //   it("updates policy number input filter on change", () => {
  //     render(<SalesFilters />);
  //   });

  //   it("updates insurance type input filter on change", () => {
  //     render(<SalesFilters />);
  //   });

  //   it("updates date input filter on change", () => {
  //     render(<SalesFilters />);
  //   });

  //   it("pagination works on the table [wip]", () => {
  //     render(<SalesHistory />);
  //   });
});
