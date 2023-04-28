// (c) Delta Software 2023, rights reserved.

import React, { useState, useEffect } from "react";

import { Table } from "flowbite-react";
import SalesRow from "./SalesRow";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export interface AssuranceType {
  id: string;
  name: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
export interface IListSalesProps {
  sales: {
    id: string;
    policyNumber: string;
    assuranceType: AssuranceType;
    sellDate: Date;
    amountInCents: string;
    clientName: string;
    status: string;
    periodicity: string;
    user: User;
    evidenceUrl: string;
  }[];
  onDeleted: () => void;
}

export const SalesTable = ({ sales, onDeleted }: IListSalesProps) => {
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  useEffect(() => {
    if (shouldUpdate) {
      onDeleted();
      setShouldUpdate(false);
    }
  }, [shouldUpdate]);

  return (
    <div data-testid="Table" className="grid grid-row w-full pb-4 px-8">
      <div className="row">
        <Link to="/new-sale">
          <div className="w-44 pb-8 float-right pr-8">
            <button className="btn-primary flex justify-center items-center">
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
          <Table.HeadCell>Monto</Table.HeadCell>
          <Table.HeadCell>Tipo de Seguro</Table.HeadCell>
          <Table.HeadCell>Fecha</Table.HeadCell>
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
                id={sale.id}
                clientName={sale.clientName}
                amountInCents={sale.amountInCents}
                assuranceTypeName={sale.assuranceType.name}
                sellDate={sale.sellDate}
                status={sale.status}
                policyNum={sale.policyNumber}
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
