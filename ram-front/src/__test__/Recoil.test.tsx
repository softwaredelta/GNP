// (c) Delta Software 2023, rights reserved.

import { snapshot_UNSTABLE } from "recoil";
import { testRender } from "./fixture";
import { bar$, foo$ } from "../lib/example/recoil";
import { waitFor } from "@testing-library/react";

describe("Recoil", () => {
  let container: HTMLDivElement;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });

  describe("snapshots", () => {
    it("is initialized with the default value", () => {
      testRender(container, <></>);

      const ss = snapshot_UNSTABLE();
      ss.retain();

      expect(ss.getLoadable(foo$).valueOrThrow()).toBe(0);
    });

    it("has independent tests", async () => {
      testRender(container, <></>);

      const ss = snapshot_UNSTABLE();
      ss.retain();

      (await ss.getPromise(bar$)).update((x) => x + 1);
      waitFor(() => {
        expect(ss.getLoadable(bar$).valueOrThrow().multiplied).toBe(100);
      });
    });

    it("has independent tests 2", async () => {
      testRender(container, <></>);

      const ss = snapshot_UNSTABLE();
      ss.retain();

      (await ss.getPromise(bar$)).update((x) => x + 2);
      waitFor(() => {
        expect(ss.getLoadable(bar$).valueOrThrow().multiplied).toBe(200);
      });
    });
  });
});
