// (c) Delta Software 2023, rights reserved.

import { render, fireEvent, screen, act } from "@testing-library/react";
import NewSaleOld from "../pages/NewSaleOld";
import { RecoilRoot } from "recoil";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";

describe("NewSale", () => {
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
            <NewSaleOld />
          </Suspense>
        </RecoilRoot>,
      );
    });
  });

  it("updates policy number input on change", () => {
    render(<NewSaleOld />);
    const policyNumInput: HTMLInputElement = screen.getByPlaceholderText(
      "Ingrese el número de poliza",
    );
    fireEvent.change(policyNumInput, { target: { value: "1234567" } });
    expect(policyNumInput.value).toBe("1234567");
  });

  it("updates date input on change", () => {
    render(<NewSaleOld />);
    const datePicker: HTMLInputElement = screen.getByLabelText("Fecha");
    fireEvent.change(datePicker, { target: { value: "18/04/2023" } });
    expect(datePicker.value).toBe("18/04/2023");
  });

  it("updates amount input on change", () => {
    render(<NewSaleOld />);
    const amountInput: HTMLInputElement = screen.getByPlaceholderText(
      "Ingrese el monto de la venta",
    );
    fireEvent.change(amountInput, { target: { value: "1000" } });
    expect(amountInput.value).toBe("1000");
  });

  it("updates client name input on change", () => {
    render(<NewSaleOld />);
    const clientInput: HTMLInputElement = screen.getByTestId("clientInput");
    fireEvent.change(clientInput, { target: { value: "John Doe" } });
    expect(clientInput.value).toBe("John Doe");
  });
});
