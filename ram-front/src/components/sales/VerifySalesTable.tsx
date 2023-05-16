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
    paidDate: Date;
    yearlyFee: string;
    contractingClient: string;
    status: string;
    periodicity: string;
    user: User;
    evidenceUrl: string;
  }[];
  onUpdated?: () => void;
}

export const VerifySalesTable = ({ sales }: IListSalesProps) => {
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  useEffect(() => {
    if (shouldUpdate) {
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
          {sales.length === 0 && (
            <div className="text-center">No hay ventas para verificar</div>
          )}
          {sales.map((sale) => {
            return (
              <VerifySalesRow
                key={sale.id}
                id={sale.id}
                agentName={sale.user.email}
                contractingClient={sale.contractingClient}
                yearlyFee={sale.yearlyFee}
                assuranceTypeName={sale.assuranceType.name}
                paidDate={sale.paidDate}
                status={sale.status}
                policyNum={sale.policyNumber}
                evidenceUrl={sale.evidenceUrl}
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
