// (c) Delta Software 2023, rights reserved.

import { Table } from "flowbite-react";
import { FaTrash, FaEdit } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import { ISell } from "../../types";
import { NumericFormat } from "react-number-format";
import { useEffect } from "react";

type Props = {
  sale: ISell;
  updateSales: () => void;
};

export default function SalesRow({ sale, updateSales }: Props) {
  const { response, callback } = useAxios({
    url: `sales/delete/${sale.id}`,
    method: "POST",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (response) {
      Swal.fire("Eliminado", "La venta ha sido eliminada", "success").then(
        () => {
          updateSales();
        },
      );
    }
  }, [response]);

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
      <Table.Cell className="w-max max-w-[200px] overflow-hidden whitespace-nowrap  pr-10 font-medium text-gray-900 dark:text-white">
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
        <div className="grid w-full min-w-[50px] grid-cols-2 items-center justify-center gap-5 ">
          <div>
            <FaEdit
              onClick={() => navigate(`/modify-sale/${sale.id}`)}
              color="gray"
              className="hover:scale-105 hover:fill-blue-700"
              size={20}
            />
          </div>
          <div>
            <FaTrash
              onClick={handleDelete}
              className="hover:scale-105 hover:fill-red-500"
              size={17}
            />
          </div>
        </div>
      </Table.Cell>
    </Table.Row>
  );
}
