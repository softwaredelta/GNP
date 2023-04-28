// (c) Delta Software 2023, rights reserved.

import React, { useState, useEffect } from "react";

import { Table } from "flowbite-react";
import VerifySalesRow from "./VerifySalesRow";

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
  onUpdated: () => void;
}

export const VerifySalesTable = ({ sales, onUpdated }: IListSalesProps) => {
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  useEffect(() => {
    if (shouldUpdate) {
      onUpdated();
      setShouldUpdate(false);
    }
  }, [shouldUpdate]);

  return (
    <div data-testid="Table" className="w-full p-8">
      <Table hoverable={true}>
        <Table.Head>
          <Table.HeadCell>Nombre del agente</Table.HeadCell>
          <Table.HeadCell>Nombre del Cliente</Table.HeadCell>
          <Table.HeadCell>Póliza</Table.HeadCell>
          <Table.HeadCell>Monto</Table.HeadCell>
          <Table.HeadCell>Tipo de Seguro</Table.HeadCell>
          <Table.HeadCell>Fecha</Table.HeadCell>
          <Table.HeadCell>Estado</Table.HeadCell>
          <Table.HeadCell> Acciones </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
        { sales.length === 0 && <div className="text-center">No hay ventas para verificar</div>}
          {sales.map((sale) => {
            return (
              <VerifySalesRow
                key={sale.id}
                id={sale.id}
                agentName={sale.user.id}
                clientName={sale.clientName}
                amountInCents={sale.amountInCents}
                assuranceTypeName={sale.assuranceType.name}
                sellDate={sale.sellDate}
                status={sale.status}
                policyNum={sale.policyNumber}
                onUpdated={() => {
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