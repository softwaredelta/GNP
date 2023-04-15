// (c) Delta Software 2023, rights reserved.

// eslint-disable-next-line import/no-extraneous-dependencies
import { act } from "@testing-library/react";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
// eslint-disable-next-line import/no-extraneous-dependencies
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";
// eslint-disable-next-line import/named
import { MutableSnapshot, RecoilRoot } from "recoil";

function TestRoot({
  children,
  initializeState,
}: {
  children: React.ReactNode;
  initializeState: (state: MutableSnapshot) => void;
}) {
  return (
    <ErrorBoundary fallback={<div data-testid="render-error">error</div>}>
      <Suspense fallback={<p>loading...</p>}>
        <RecoilRoot initializeState={initializeState}>
          <BrowserRouter>
            <>{children}</>
          </BrowserRouter>
        </RecoilRoot>
      </Suspense>
    </ErrorBoundary>
  );
}

export function testRender(
  container: HTMLDivElement,
  children: React.ReactNode,
  initializeState: (state: MutableSnapshot) => void = () => {},
): void {
  act(() => {
    createRoot(container).render(
      <TestRoot initializeState={initializeState}>
        <>{children}</>
      </TestRoot>,
    );
  });
}
