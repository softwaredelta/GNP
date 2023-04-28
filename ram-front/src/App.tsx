// (c) Delta Software 2023, rights reserved.

import React from "react";
import { RecoilRoot } from "recoil";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { AuthenticationHandler } from "./lib/api/api-auth";
import { HashProvider } from "./lib/api/api-hash";

export function App({
  hash,
  children,
}: {
  hash: string;
  children?: React.ReactNode;
}) {
  return (
    <React.Suspense fallback={<p>loading site...</p>}>
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div role="alert">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
          </div>
        )}
      >
        <RecoilRoot>
          <BrowserRouter>
            <HashProvider value={hash}>
              <AuthenticationHandler />
              {children}
            </HashProvider>
          </BrowserRouter>
        </RecoilRoot>
      </ErrorBoundary>
    </React.Suspense>
  );
}
