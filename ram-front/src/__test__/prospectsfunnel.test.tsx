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
                imageURL: "",
              },
              {
                id: "2",
                email: "test2",
                imageURL: "",
              },
            ]}
          ></FunnelTable>
        </BrowserRouter>
      </RecoilRoot>,
    );

    const agent1 = screen.getByText("test");
    expect(agent1).toBeInTheDocument();

    const agent2 = screen.getByText("test2");
    expect(agent2).toBeInTheDocument();
  });
});
