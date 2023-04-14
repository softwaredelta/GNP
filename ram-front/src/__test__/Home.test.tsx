// (c) Delta Software 2023, rights reserved.

import { RecoilRoot } from "recoil";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { Home } from "../pages/Home";

describe("Home", () => {
  let container: HTMLDivElement;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });

  it("renders api url", async () => {
    act(() => {
      createRoot(container).render(
        <RecoilRoot>
          <Suspense>
            <Home />
          </Suspense>
        </RecoilRoot>,
      );
    });
  });
});
