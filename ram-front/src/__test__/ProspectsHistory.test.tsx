// (c) Delta Software 2023, rights reserved.

import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import ProspectListHistory from "../components/prospects/ProspectListHistory";

describe("ProspectHistoryList", () => {
  let container: HTMLDivElement;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });

  it("renders history", () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <ProspectListHistory
            state={"Cliente"}
            comment={
              "Mantén una actitud positiva y entusiasta durante todo el proceso de venta. La energía positiva es contagiosa y puede marcar la diferencia."
            }
            date={"25/07/2002"}
          ></ProspectListHistory>
        </BrowserRouter>
      </RecoilRoot>,
    );
    expect(screen.getByTestId("prospect-list")).toBeInTheDocument();
  });
});
