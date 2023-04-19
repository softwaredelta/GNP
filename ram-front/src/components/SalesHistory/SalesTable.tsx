// (c) Delta Software 2023, rights reserved.

import React, { useState, useEffect } from "react";

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
    poliza: 123457,
    insuranceType: "Mascotas",
    state: "Rechazado",
  },
  {
    clientName: "Karen López",
    monto: 14200,
    date: new Date("2022-01-01"),
    poliza: 123458,
    insuranceType: "Vida",
    state: "Aceptado",
  },
  {
    clientName: "Mónica Ayala",
    monto: 10000,
    date: new Date("2023-05-01"),
    poliza: 123459,
    insuranceType: "Gastos Médicos",
    state: "Sin revisar",
  },
  {
    clientName: "Renato Ramírez",
    monto: 5000,
    date: new Date("2021-05-10"),
    poliza: 123450,
    insuranceType: "Vida",
    state: "Aceptado",
  },
  {
    clientName: "Jennifer Lee",
    monto: 20000,
    date: new Date("2023-03-01"),
    poliza: 789012,
    insuranceType: "Hogar",
    state: "Aceptado",
  },
  {
    clientName: "David Kim",
    monto: 10000,
    date: new Date("2023-04-02"),
    poliza: 789013,
    insuranceType: "Hogar",
    state: "En proceso",
  },
  {
    clientName: "Anna Chen",
    monto: 5000,
    date: new Date("2023-03-15"),
    poliza: 789014,
    insuranceType: "Hogar",
    state: "Rechazado",
  },
  {
    clientName: "Jason Huang",
    monto: 15000,
    date: new Date("2023-04-05"),
    poliza: 789015,
    insuranceType: "Hogar",
    state: "Aceptado",
  },
  {
    clientName: "Eric Liu",
    monto: 8000,
    date: new Date("2023-03-20"),
    poliza: 789016,
    insuranceType: "Hogar",
    state: "Sin revisar",
  },
  {
    clientName: "Emily Brown",
    monto: 4500,
    date: new Date("2023-03-10"),
    poliza: 567893,
    insuranceType: "Auto",
    state: "Sin revisar",
  },
  {
    clientName: "David Rodriguez",
    monto: 3000,
    date: new Date("2023-04-01"),
    poliza: 567894,
    insuranceType: "Auto",
    state: "Aceptado",
  },
];

type Props = {
  indexStart: number;
  indexEnd: number;
  testid?: string;
};

export const SalesTable = (props: Props) => {
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
          {sales.slice(props.indexStart, props.indexEnd).map((sale) => {
            return (
              <Table.Row
                key={sale.poliza}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {sale.clientName}
                </Table.Cell>
                <Table.Cell>{sale.poliza}</Table.Cell>
                <Table.Cell>{sale.monto}</Table.Cell>
                <Table.Cell>{sale.insuranceType}</Table.Cell>
                <Table.Cell>{sale.date.toLocaleDateString()}</Table.Cell>
                <Table.Cell>{sale.state}</Table.Cell>
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
