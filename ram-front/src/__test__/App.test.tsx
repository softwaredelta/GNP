// (c) Delta Software 2023, rights reserved.

import { screen, waitFor } from "@testing-library/react";
import App from "../App";
import { RecoilRoot } from "recoil";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

describe("App", () => {
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
            <App />
          </Suspense>
        </RecoilRoot>,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("api-base").textContent).toBe(
        "API base: http://test.dev",
      );
    });
  });
});
