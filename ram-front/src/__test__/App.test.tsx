// (c) Delta Software 2023, rights reserved.

import { add } from "../lib/math";

// Frontend tests _are not_ meant to test the backend!
// Instead we should test pure components to make sure they
// render correctly and that they handle user input correctly.
// We can also test logic or functionality that does not depend
// on any connections.

test("Math function works correctly", () => {
  expect(add(1, 2)).toBe(3);
});
