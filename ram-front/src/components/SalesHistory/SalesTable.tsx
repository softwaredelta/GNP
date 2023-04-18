// (c) Delta Software 2023, rights reserved.

import React from "react";
import { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import { FaTrash } from "react-icons/fa";

// Prueba con "datos" estáticos
const INITIAL_STATE = [
  {
    clientName: "Fermín Mendez",
    monto: 1000,
    date: new Date("01-01-2021"),
    poliza: 123456,
    insuranceType: "Vida",
    state: "Aceptado",
  },
  {
    clientName: "Kenny Vercamer",
    monto: 1000,
    date: new Date("2021-01-01"),
    poliza: 123456,
    insuranceType: "Mascotas",
    state: "Rechazado",
  },
  {
    clientName: "Karen López",
    monto: 14200,
    date: new Date("2022-01-01"),
    poliza: 123456,
    insuranceType: "Vida",
    state: "Aceptado",
  },
  {
    clientName: "Mónica Ayala",
    monto: 10000,
    date: new Date("2023-05-01"),
    poliza: 123456,
    insuranceType: "Gastos Médicos",
    state: "Sin revisar",
  },
  {
    clientName: "Renato Ramírez",
    monto: 5000,
    date: new Date("2021-05-10"),
    poliza: 123456,
    insuranceType: "Vida",
    state: "Aceptado",
  },
];

export const SalesTable = () => {
  interface Sale {
    clientName: string;
    monto: number;
    date: Date;
    poliza: number;
    insuranceType: string;
    state: string;
  }

  const [sales, setSales] = useState<Array<Sale>>([]);
  useEffect(() => {
    setSales(INITIAL_STATE);
  }, []);

  return (
    <div className="w-full p-8">
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
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {sale.clientName}
                </Table.Cell>
                <Table.Cell>{sale.poliza}</Table.Cell>
                <Table.Cell>{sale.monto}</Table.Cell>
                <Table.Cell>{sale.insuranceType}</Table.Cell>
                <Table.Cell>{sale.date.toLocaleDateString()}</Table.Cell>
                <Table.Cell>{sale.state}</Table.Cell>
                <Table.Cell>
                  <FaTrash className=" hover:fill-red-500" />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};
