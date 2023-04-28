// (c) Delta Software 2023, rights reserved.

import { ExoticComponent, LazyExoticComponent } from "react";

export interface IRoute {
  path: string;
  component: ExoticComponent | LazyExoticComponent<never>;
}
