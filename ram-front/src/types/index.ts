// (c) Delta Software 2023, rights reserved.

export interface IRoute {
  path: string;
  Component: () => JSX.Element;
}
