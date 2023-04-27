// (c) Delta Software 2023, rights reserved.

import { act } from "@testing-library/react";
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
});
