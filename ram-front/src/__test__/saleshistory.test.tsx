// (c) Delta Software 2023, rights reserved.

import { render, screen, act, waitFor } from "@testing-library/react";
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

  it("renders pagination component", async () => {
    render(<SalesHistory />);
    await waitFor(() => {
      expect(screen.getByTestId("paginationComponent")).toBeInTheDocument();
    });
  });

  it("renders sales table component", async () => {
    render(<SalesHistory />);
    await waitFor(() => {
      expect(screen.getByTestId("salesTable")).toBeInTheDocument();
    });
  });

  it("renders filters component", async () => {
    render(<SalesHistory />);
    await waitFor(() => {
      expect(screen.getByTestId("salesFilters")).toBeInTheDocument();
    });
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
