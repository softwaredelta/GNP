// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1338476890
// * M2_S04
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1535256513
// * M2_S07

import React, { useEffect, useState } from "react";

import { Table } from "flowbite-react";
import Pagination from "../generics/Pagination";
import VerifySalesRow from "./VerifySalesRow";
import { ISell } from "../../types";
import { Column, usePagination, useTable } from "react-table";
import { NumericFormat } from "react-number-format";
import ManagerSalesFilters from "./ManagerSalesFilters";
export interface IListSalesProps {
  sales: ISell[];
  onUpdatedVerifySales: () => void;
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

export const VerifySalesTable = ({
  sales,
  onUpdatedVerifySales,
}: IListSalesProps) => {
  const [data, setData] = useState<ISell[]>(sales);

  useEffect(() => {
    setData(sales);
  }, [sales]);

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
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination,
  );

  return (
    <div data-testid="Table" className="w-full p-8">
      <div>
        <ManagerSalesFilters sales={sales} setSales={setData} />
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
              <VerifySalesRow
                key={sale.id}
                sale={sale.original}
                onUpdated={() => {
                  onUpdatedVerifySales();
                }}
              />
            );
          })}
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {"Total"}
            </Table.Cell>
            <Table.Cell>{""}</Table.Cell>
            <Table.Cell>
              <NumericFormat
                value={data
                  .map((sale) => sale.yearlyFee)
                  .reduce((a, b) => Number(a) + Number(b), 0)}
                displayType={"text"}
                thousandSeparator={true}
                decimalScale={2}
                decimalSeparator="."
                fixedDecimalScale={true}
                prefix={"$"}
              />
            </Table.Cell>
            <Table.Cell>
              <NumericFormat
                value={data
                  .map((sale) => sale.paidFee)
                  .reduce((a, b) => Number(a) + Number(b), 0)}
                displayType={"text"}
                thousandSeparator={true}
                decimalScale={2}
                decimalSeparator="."
                fixedDecimalScale={true}
                prefix={"$"}
              />{" "}
            </Table.Cell>
            <Table.Cell>{""}</Table.Cell>
            <Table.Cell>{""}</Table.Cell>
            <Table.Cell>{""}</Table.Cell>
            <Table.Cell>{""}</Table.Cell>
            <Table.Cell>{""}</Table.Cell>
            <Table.Cell>{""}</Table.Cell>
          </Table.Row>
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
