// (c) Delta Software 2023, rights reserved.

import { Root } from "react-dom/client";
import { BehaviorSubject } from "rxjs";
import { AuthenticationApi, useAuthentication } from "../lib/api/api-auth";
import { useEffect } from "react";
import { act, waitFor } from "@testing-library/react";
import { App } from "../App";

export class RenderTest {
  authenticationBS: BehaviorSubject<AuthenticationApi | null> =
    new BehaviorSubject<AuthenticationApi | null>(null);

  constructor(
    private uniqueName: string,
    private children: React.ReactNode,
    private root: Root,
  ) {}

  async start() {
    const ApiHelper = () => {
      const authenticationH = useAuthentication();

      useEffect(() => {
        this.authenticationBS.next(authenticationH);
      }, [authenticationH]);

      return <></>;
    };

    act(() => {
      this.root.render(
        <App hash={this.uniqueName}>
          {this.children}
          <ApiHelper />
        </App>,
      );
    });

    await waitFor(() => {
      expect(this.authenticationBS.value).not.toBeNull();
    });
  }

  get authentication(): AuthenticationApi {
    if (this.authenticationBS.value === null) {
      throw new Error("Authentication not initialized");
    }
    return this.authenticationBS.value;
  }
}
