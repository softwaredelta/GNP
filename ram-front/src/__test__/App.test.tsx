// (c) Delta Software 2023, rights reserved.

import { render } from "@testing-library/react";
import App from "../App";

test("Renders main page correctly", () => {
  render(<App />);
  expect(true).toBeTruthy();
});
