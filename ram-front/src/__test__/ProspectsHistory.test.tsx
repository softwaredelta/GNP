// (c) Delta Software 2023, rights reserved.

import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import ProspectsHistoryTable from "../components/prospects/ProspectHistoryTable";

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
          <ProspectsHistoryTable
            History={[
              {
                id: "1",
                updatedStatusDate: new Date(),
                statusComment: "Mostró interés en el proceso",
                status: {
                  id: "1",
                  statusName: "Cliente",
                },
              },
              {
                id: "2",
                updatedStatusDate: new Date(),
                statusComment: "No se pudo contactar al cliente",
                status: {
                  id: "2",
                  statusName: "Primera llamada",
                },
              },
            ]}
          ></ProspectsHistoryTable>
        </BrowserRouter>
      </RecoilRoot>,
    );

    expect(screen.getByTestId("prospect-list")).toBeInTheDocument();
  });
});
