// (c) Delta Software 2023, rights reserved.

import React from "react";

import { Table } from "flowbite-react";
import { FaTrash } from "react-icons/fa";

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
}

export const SalesTable = ({ sales }: IListSalesProps) => {
  return (
    <div data-testid="Table" className="w-full p-8">
      <Table hoverable={true}>
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
              <Table.Row
                key={sale.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {sale.clientName}
                </Table.Cell>
                <Table.Cell>{sale.clientName}</Table.Cell>
                <Table.Cell>{sale.amountInCents}</Table.Cell>
                <Table.Cell>{sale.assuranceType.name}</Table.Cell>
                <Table.Cell>{new Date(sale.sellDate).getDate()}</Table.Cell>
                <Table.Cell>{sale.status}</Table.Cell>
                <Table.Cell>
                  <FaTrash className=" hover:fill-red-500 hover:scale-105" />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};
