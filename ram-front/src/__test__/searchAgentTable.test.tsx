// (c) Delta Software 2023, rights reserved.
import "@testing-library/jest-dom/extend-expect";
import { Root, createRoot } from "react-dom/client";
import { RenderTest } from "./fixtures";
import SearchAgentTable from "../components/tables/SearchAgentTable";
import { screen } from "@testing-library/react";

describe("New Search Agent Table", () => {
  let container: HTMLDivElement;
  let root: Root;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    root = createRoot(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });
  describe("renders a message when there are no agents", () => {
    it("redirects to login", async () => {
      const test = new RenderTest(
        "authentication-0",
        <SearchAgentTable groupId="" onReloadAgents={() => {}} agents={[]} />,
        root,
      );
      await test.start();

      const message = screen.getByText("No hay agentes en el grupo");
      expect(message).toBeInTheDocument();
    });
  });

  describe("renders an agent correctly", () => {
    it("redirects to login", async () => {
      const test = new RenderTest(
        "authentication-0",
        (
          <SearchAgentTable
            groupId=""
            onReloadAgents={() => {}}
            agents={[
              {
                id: "1",
                email: "user-test@tec.mx",
                imageUrl:
                  "https://www.icegif.com/wp-content/uploads/2023/01/icegif-1544.gif",
                name: "Juan",
                lastName: "Velasco",
              },
            ]}
          />
        ),
        root,
      );
      await test.start();

      const agent = screen.getByText("Juan Velasco");
      expect(agent).toBeInTheDocument();
    });
  });
});
