// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=832442920
// * M2_S02
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1423929641
// * M2_S03
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1535256513
// * M2_S07

import { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import SalesRow from "./SalesRow";
import { IAssuranceType, ISell } from "../../types";
import { Column, usePagination, useTable } from "react-table";
import Pagination from "../generics/Pagination";
import SalesFilters from "./SalesFilters";
import { NumericFormat } from "react-number-format";
import { useFilters } from "../../hooks/useFilters";
import { FiFilter, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import useAxios from "../../hooks/useAxios";

export interface IListSalesProps {
  sales: ISell[];
  updateSales: (newBody?: object) => Promise<boolean>;
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

export const SalesTable = ({ sales, updateSales }: IListSalesProps) => {
  const [data, setData] = useState<ISell[]>(sales);
  const { isFilterOpen, toggleFilter } = useFilters();
  const { response: assuranceTypes } = useAxios<IAssuranceType[]>({
    url: "assurance-types/all",
    method: "GET",
  });
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
    <div data-testid="sales-table" className="grid-row grid w-full px-8 pb-4">
      <div className="flex items-center justify-center space-x-10 pb-10">
        <Link to="/new-sale">
          <button className="btn-primary flex w-20 items-center justify-center">
            <span className="font-semibold"> Nueva venta </span>
            <FiPlus size={20} className="ml-2" />
          </button>
        </Link>
        <div className="w-48">
          <button
            onClick={toggleFilter}
            className={`${
              isFilterOpen ? "btn-primary" : "btn-border"
            } flex  items-center justify-center`}
          >
            {!isFilterOpen ? "Mostrar filtros" : "Ocultar filtros"}{" "}
            <FiFilter className="ml-2 inline-block" />
          </button>
        </div>
      </div>
      <div>
        {isFilterOpen && assuranceTypes && (
          <SalesFilters
            updateSales={updateSales}
            assuranceTypes={assuranceTypes}
          />
        )}
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
                updateSales={updateSales}
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
