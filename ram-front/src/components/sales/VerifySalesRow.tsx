// (c) Delta Software 2023, rights reserved.

import { Table } from "flowbite-react";
import React from "react";
import { FiEye, FiCheck, FiX } from "react-icons/fi";
import { NumericFormat } from "react-number-format";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import useModal from "../../hooks/useModal";
import { useOpenFile } from "../../lib/files";
import { ISell } from "../../types";
import Modal from "../generics/Modal";

type Props = {
  sale: ISell;
  onUpdated: () => void;
};

export default function SalesRow({ sale, onUpdated }: Props) {
  const { isOpen, toggleModal } = useModal();
  const { callback } = useAxios({
    url: `sales/update-status/${sale.id}`,
    method: "POST",
    body: {},
  });

  const openFile = useOpenFile();

  async function handleUpdate(statusChange: string) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed && callback) {
        callback({
          statusChange,
        });
        Swal.fire(
          `¡Éxito!`,
          `La venta ha sido ${statusChange}.`,
          "success",
        ).then(() => {
          onUpdated();
        });
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
        <div className="grid grid-cols-3 items-center justify-center ">
          <div className="mx-2 cursor-pointer transition-all ease-in-out hover:scale-110 active:scale-95">
            <FiEye
              size={20}
              className="text-gray-500"
              onClick={() => openFile(sale.evidenceUrl as string)}
            />
          </div>

          {isOpen && (
            <Modal closeModal={toggleModal}>
              <div>
                <h1 className="text-2xl font-bold">Descarga el archivo</h1>
                <img
                  src="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg"
                  alt="placeholder de archivo"
                />
              </div>
            </Modal>
          )}
          <div className="mx-2 cursor-pointer transition-all ease-in-out hover:scale-125 active:scale-95">
            <FiCheck
              size={20}
              className="text-green-500"
              onClick={() => handleUpdate("aceptada")}
            />
          </div>
          <div className="mx-2 cursor-pointer transition-all ease-in-out hover:scale-125 active:scale-95">
            <FiX
              size={20}
              className="text-red-500"
              onClick={() => handleUpdate("rechazada")}
            />
          </div>
        </div>
      </Table.Cell>
    </Table.Row>
  );
}
