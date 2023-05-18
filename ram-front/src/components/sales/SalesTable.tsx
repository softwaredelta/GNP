// (c) Delta Software 2023, rights reserved.

import React, { useState, useEffect } from "react";

import { Table } from "flowbite-react";
import SalesRow from "./SalesRow";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ISell } from "../../types";

export interface IListSalesProps {
  sales: ISell[];
  onDeleted: () => void;
}

export const SalesTable = ({ sales, onDeleted }: IListSalesProps) => {
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
          <Table.HeadCell>Nombre del Cliente</Table.HeadCell>
          <Table.HeadCell>Póliza</Table.HeadCell>
          <Table.HeadCell>Prima Anual</Table.HeadCell>
          <Table.HeadCell>Prima Pagada</Table.HeadCell>
          <Table.HeadCell>Periodicidad</Table.HeadCell>
          <Table.HeadCell>Tipo de Seguro</Table.HeadCell>
          <Table.HeadCell>Fecha Emisión</Table.HeadCell>
          <Table.HeadCell>Fecha Pago</Table.HeadCell>
          <Table.HeadCell>Estado</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {sales.map((sale) => {
            return (
              <SalesRow
                key={sale.id}
                sale={sale}
                onDeleted={() => {
                  setShouldUpdate(true);
                }}
              />
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};
