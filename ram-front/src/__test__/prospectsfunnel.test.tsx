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
                email: "test1@mail.com",
                name: "test",
                lastName: "1",
                imageURL: "",
                roles: ["regular"],
                sell: [],
                registerDate: new Date(),
                roleString: "regular",
              },
              {
                id: "2",
                email: "test2@mail.com",
                name: "test",
                lastName: "2",
                imageURL: "",
                roles: ["regular"],
                sell: [],
                registerDate: new Date(),
                roleString: "regular",
              },
            ]}
          ></FunnelTable>
        </BrowserRouter>
      </RecoilRoot>,
    );
    expect(screen.getByTestId("funnel-table")).toBeInTheDocument();
  });
});
