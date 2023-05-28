// (c) Delta Software 2023, rights reserved.

import { Table } from "flowbite-react";
import { FaTrash, FaEdit } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import { ISell } from "../../types";
import { NumericFormat } from "react-number-format";

type Props = {
  sale: ISell;
  onDeleted: () => void;
};

export default function SalesRow({ sale, onDeleted }: Props) {
  const { callback } = useAxios({
    url: `sales/delete/${sale.id}`,
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

  const capitalize = (word: string): string => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  };
  return (
    <Table.Row
      key={sale.id}
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {sale.contractingClient}
      </Table.Cell>
      <Table.Cell>{sale.policyNumber}</Table.Cell>
      <Table.Cell>
        <NumericFormat
          value={sale.yearlyFee}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={2}
          decimalSeparator="."
          fixedDecimalScale={true}
          prefix={"$"}
        />
      </Table.Cell>
      <Table.Cell>
        <NumericFormat
          value={sale.paidFee}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={2}
          decimalSeparator="."
          fixedDecimalScale={true}
          prefix={"$"}
        />{" "}
      </Table.Cell>
      <Table.Cell>{sale.periodicity}</Table.Cell>
      <Table.Cell>{sale.assuranceType?.name}</Table.Cell>
      <Table.Cell>
        {new Date(sale.emissionDate as Date).toLocaleDateString()}
      </Table.Cell>
      <Table.Cell>
        {new Date(sale.paidDate as Date).toLocaleDateString()}
      </Table.Cell>
      <Table.Cell>{capitalize(sale.status)}</Table.Cell>
      <Table.Cell>
        <div className="grid grid-cols-2 items-center justify-center ">
          <FaEdit
            onClick={() => navigate(`/modify-sale/${sale.id}`)}
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
