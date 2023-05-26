// (c) Delta Software 2023, rights reserved.

import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import FunnelTable from "../components/prospects/FunnelTable";
import { RecoilRoot } from "recoil";

describe("Prospect Funnel", () => {
  let container: HTMLDivElement;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });

  it("renders all the agents", () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <FunnelTable
            agents={[
              {
                id: "1",
                email: "test",
                name: "test",
                lastName: "test",
                imageUrl: "",
              },
              {
                id: "2",
                email: "test2",
                name: "test2",
                lastName: "test2",
                imageUrl: "",
              },
            ]}
          ></FunnelTable>
        </BrowserRouter>
      </RecoilRoot>,
    );
    expect(screen.getByTestId("funnel-table")).toBeInTheDocument();
  });
});
