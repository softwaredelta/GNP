// (c) Delta Software 2023, rights reserved.

export interface IAlert {
  type: "success" | "error" | "warning" | "info";
  message: string;
  description: string;
}
