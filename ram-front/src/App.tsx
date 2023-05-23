// (c) Delta Software 2023, rights reserved.

import React from "react";
import { RecoilRoot, useRecoilValue } from "recoil";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import {
  AuthenticationHandler,
  AuthenticationInitializationHandler,
  isAuthenticationReady$,
} from "./lib/api/api-auth";
import { HashProvider } from "./lib/api/api-hash";
import useLoader from "./hooks/useLoader";
import BlockPage from "./components/loaders/BlockPage";

// makes sure app is only rendered once auth initialization is complete
export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const isAuthenticationReady = useRecoilValue(isAuthenticationReady$);
  const { loading } = useLoader();

  return (
    <>
      {loading && <BlockPage />}
      <AuthenticationInitializationHandler />
      {isAuthenticationReady && (
        <>
          <AuthenticationHandler />
          {children}
        </>
      )}
    </>
  );
}

export function App({
  hash,
  children,
}: {
  hash: string;
  children?: React.ReactNode;
}) {
  return (
    <React.Suspense fallback={<p></p>}>
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
              <AuthWrapper>{children}</AuthWrapper>
            </HashProvider>
          </BrowserRouter>
        </RecoilRoot>
      </ErrorBoundary>
    </React.Suspense>
  );
}
