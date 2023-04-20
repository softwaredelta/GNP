import { ExoticComponent, LazyExoticComponent } from "react";

export interface IRoute {
    path: string;
    component: ExoticComponent | LazyExoticComponent<any>;
  }