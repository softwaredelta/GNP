// (c) Delta Software 2023, rights reserved.

import { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import SalesRow from "./SalesRow";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ISell } from "../../types";
import { Column, usePagination, useTable } from "react-table";
import Pagination from "../generics/Pagination";

export interface IListSalesProps {
  sales: ISell[];
  onDeleted: () => void;
}

const columns: Column<ISell>[] = [
  {
    Header: "Nombre del Cliente",
    accessor: "user",
  },
  {
    Header: "Póliza",
    accessor: "policyNumber",
  },
  {
    Header: "Prima Anual",
    accessor: "yearlyFee",
  },
  {
    Header: "Prima Pagada",
    accessor: "paidFee",
  },
  {
    Header: "Periocidad",
    accessor: "periodicity",
  },

  {
    Header: "Tipo de Seguro",
    accessor: "assuranceType",
  },
  {
    Header: "Fecha Emisión",
    accessor: "emissionDate",
  },
  {
    Header: "Fecha Pago",
    accessor: "paidDate",
  },
  {
    Header: "Estado",
    accessor: "status",
  },
];

export const SalesTable = ({ sales, onDeleted }: IListSalesProps) => {
  const {
    page,
    pageOptions,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    state,
  } = useTable(
    {
      columns,
      data: sales,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination,
  );

  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  useEffect(() => {
    if (shouldUpdate) {
      onDeleted();
      setShouldUpdate(false);
    }
  }, [onDeleted, shouldUpdate]);

  return (
    <div data-testid="sales-table" className="grid-row grid w-full px-8 pb-4">
      <div className="row">
        <Link to="/new-sale">
          <div className="float-right w-44 pb-8 pr-8">
            <button className="btn-primary flex items-center justify-center">
              <span className="font-semibold"> Agregar </span>
              <FaPlus size={15} className="ml-2" />
            </button>
          </div>
        </Link>
      </div>
      <Table className="row" hoverable={true}>
        <Table.Head>
          {columns.map((column) => {
            return (
              <Table.HeadCell key={column.accessor as string}>
                {column.Header as string}
              </Table.HeadCell>
            );
          })}
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {page.map((sale) => {
            return (
              <SalesRow
                key={sale.id}
                sale={sale.original}
                onDeleted={() => {
                  setShouldUpdate(true);
                }}
              />
            );
          })}
        </Table.Body>
      </Table>
      <Pagination
        lastPage={pageOptions.length}
        pageCurrent={state.pageIndex + 1}
        canNextPage={canNextPage}
        canPreviousPage={canPreviousPage}
        nextPage={nextPage}
        previousPage={previousPage}
      />
    </div>
  );
};
