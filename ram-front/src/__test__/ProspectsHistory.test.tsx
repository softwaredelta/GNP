// (c) Delta Software 2023, rights reserved.

import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/dom";
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
                statusName: "Cliente",
                comments:
                  "Mantén una actitud positiva y entusiasta durante todo el proceso de venta. La energía positiva es contagiosa y puede marcar la diferencia.",
                date: new Date(),
              },
              {
                id: "2",
                statusName: "Llamada",
                comments:
                  "No temas seguir buscando nuevas oportunidades de venta. El mundo está lleno de posibilidades",
                date: new Date(),
              },
            ]}
          ></ProspectsHistoryTable>
        </BrowserRouter>
      </RecoilRoot>,
    );

    expect(screen.getByTestId("prospect-list")).toBeInTheDocument();
  });
  it("renders a message when there are no deliveries", () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <ProspectsHistoryTable History={[]} />
        </BrowserRouter>
      </RecoilRoot>,
    );
    const message = screen.getByText("No hay historial del prospecto");
    expect(message).toBeInTheDocument();
  });
});
