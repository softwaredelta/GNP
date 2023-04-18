// (c) Delta Software 2023, rights reserved.

import React from "react";
import { SalesTable } from "../components/SalesHistory/SalesTable";
import { SalesFilters } from "../components/SalesHistory/SalesFilters";

export const SalesHistory = () => {
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <SalesFilters />
      <SalesTable />
    </div>
  );
};
