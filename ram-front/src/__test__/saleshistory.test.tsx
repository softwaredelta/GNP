// (c) Delta Software 2023, rights reserved.

import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SalesHistory from "../pages/SalesHistory";
import { RecoilRoot } from "recoil";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";

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
    const tableComponent = screen.getByTestId("Pagination");
    expect(tableComponent).toBeInTheDocument();
  });

  it("renders filters component", () => {
    render(<SalesHistory />);
    const filtersComponent = screen.getByTestId("Pagination");
    expect(filtersComponent).toBeInTheDocument();
  });
});
