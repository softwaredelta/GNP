// (c) Delta Software 2023, rights reserved.

import React from "react";
import { Table } from "flowbite-react";
import { FaTrash, FaEdit } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

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
        <div className="grid grid-cols-2 items-center justify-center ">
          <FaEdit
            onClick={() => navigate(`/modify-sale/${id}`)}
            color="gray"
            size={20}
            className="hover:scale-105 hover:fill-blue-700"
          />
          <FaTrash
            onClick={handleDelete}
            className="hover:scale-105 hover:fill-red-500"
          />
        </div>
      </Table.Cell>
    </Table.Row>
  );
}
