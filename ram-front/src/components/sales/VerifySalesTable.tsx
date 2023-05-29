// (c) Delta Software 2023, rights reserved.

import React, { useEffect, useState } from "react";

import { Alert, Table } from "flowbite-react";
import { AiFillWarning } from "react-icons/ai";
import VerifySalesRow from "./VerifySalesRow";
import { IUser, IAssuranceType } from "../../types";
export interface IListSalesProps {
  sales: {
    id: string;
    policyNumber: string;
    assuranceType: IAssuranceType;
    paidDate: Date;
    yearlyFee: string;
    contractingClient: string;
    status: string;
    periodicity: string;
    user: IUser;
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
          <Table.HeadCell>Prima anual</Table.HeadCell>
          <Table.HeadCell>Prima pagada</Table.HeadCell>
          <Table.HeadCell>Periodicidad</Table.HeadCell>
          <Table.HeadCell>Tipo de Seguro</Table.HeadCell>
          <Table.HeadCell>Fecha Emisión</Table.HeadCell>
          <Table.HeadCell>Fecha Pago</Table.HeadCell>
          <Table.HeadCell>Estado</Table.HeadCell>
          <Table.HeadCell> Acciones </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {sales.length === 0 && (
            <div className="flex items-center justify-center">
              <Alert
                color="info"
                icon={AiFillWarning}
                className="ml-10 w-full text-center font-bold"
              >
                <h1 className="text-base">No hay ventas para verificar</h1>
              </Alert>
            </div>
          )}
          {sales.map((sale) => {
            return (
              <VerifySalesRow
                key={sale.id}
                id={sale.id}
                agentName={sale.user.name + " " + sale.user.lastName}
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
