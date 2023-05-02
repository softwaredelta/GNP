// (c) Delta Software 2023, rights reserved.

import React, { useState } from "react";
import { Table } from "flowbite-react";
import useAxios from "../../hooks/useAxios";
import { AiOutlineEye } from "react-icons/ai";
import { FcCheckmark } from "react-icons/fc";
import { RxCross1 } from "react-icons/rx";
import Swal from "sweetalert2";
import { NumericFormat } from "react-number-format";
// import { capitalize } from "../../../utils/formats.ts";

import Modal from "../generics/Modal";
import useModal from "../../hooks/useModal";
import { useRecoilValue } from "recoil";
import { apiBase$ } from "../../lib/api/api-base";
import { useOpenFile } from "../../lib/files";

type Props = {
  id: string;
  agentName?: string;
  clientName: string;
  amountInCents: string;
  assuranceTypeName: string;
  sellDate: Date;
  status: string;
  policyNum: string;
  evidenceUrl: string;
  onUpdated: () => void;
};

export default function VerifySalesRow({
  id,
  agentName,
  clientName,
  amountInCents,
  assuranceTypeName,
  sellDate,
  status,
  policyNum,
  evidenceUrl,
  onUpdated,
}: Props) {
  const { isOpen, toggleModal } = useModal();
  const { callback } = useAxios({
    url: `sales/update-status/${id}`,
    method: "POST",
    body: {},
  });

  const openFile = useOpenFile();

  async function handleUpdate(statusChange: string) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
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
          `¡${statusChange}!`,
          `La venta ha sido ${statusChange}`,
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
      key={id}
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {agentName ? agentName : "Sin agente"}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {clientName}
      </Table.Cell>
      <Table.Cell>{policyNum}</Table.Cell>
      <Table.Cell>
        <NumericFormat
          value={amountInCents}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"$"}
        />
      </Table.Cell>
      <Table.Cell>{assuranceTypeName}</Table.Cell>
      <Table.Cell>{new Date(sellDate).toLocaleDateString()}</Table.Cell>
      <Table.Cell>{capitalize(status)}</Table.Cell>
      <Table.Cell>
        <div className="grid grid-cols-3 items-center justify-center ">
          <div className="hover:scale-125 transition-all ease-in-out active:scale-95 cursor-pointer">
            <AiOutlineEye
              size={20}
              className="text-gray-500"
              onClick={() => openFile(evidenceUrl)}
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
          <div className="hover:scale-125 transition-all ease-in-out active:scale-95 cursor-pointer">
            <FcCheckmark
              size={20}
              className="text-green-500"
              onClick={() => handleUpdate("aceptada")}
            />
          </div>
          <div className="hover:scale-125 transition-all ease-in-out active:scale-95 cursor-pointer">
            <RxCross1
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
