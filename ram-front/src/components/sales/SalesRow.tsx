// (c) Delta Software 2023, rights reserved.

import React from "react";
import { Table } from "flowbite-react";
import { FaTrash } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";

import Swal from "sweetalert2";

type Props = {
  id: string;
  contractingClient: string;
  yearlyFee: string;
  assuranceTypeName: string;
  paidDate: Date;
  status: string;
  policyNum: string;
  onDeleted: () => void;
};

export default function SalesRow({
  id,
  contractingClient,
  yearlyFee,
  assuranceTypeName,
  paidDate,
  status,
  policyNum,
  onDeleted,
}: Props) {
  const { callback } = useAxios({
    url: `sales/delete/${id}`,
    method: "POST",
    body: {},
  });

  function handleDelete() {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed && callback) {
        callback();
        Swal.fire("Eliminado", "La venta ha sido eliminada", "success").then(
          () => {
            onDeleted();
          },
        );
      }
    });
  }

  return (
    <Table.Row
      key={id}
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {contractingClient}
      </Table.Cell>
      <Table.Cell>{policyNum}</Table.Cell>
      <Table.Cell>{yearlyFee}</Table.Cell>
      <Table.Cell>{assuranceTypeName}</Table.Cell>
      <Table.Cell>{new Date(paidDate).toLocaleDateString()}</Table.Cell>
      <Table.Cell>{status}</Table.Cell>
      <Table.Cell>
        <FaTrash
          onClick={handleDelete}
          className=" hover:scale-105 hover:fill-red-500"
        />
      </Table.Cell>
    </Table.Row>
  );
}
