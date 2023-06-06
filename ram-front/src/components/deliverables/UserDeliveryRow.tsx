// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=840613660
// * M1_S06
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=95397343
// * M1_S07

import { Table } from "flowbite-react";
import { useEffect, useMemo } from "react";
import { FiCheck, FiEye, FiX } from "react-icons/fi";
import { type IconType } from "react-icons/lib";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import { useOpenFile, useUrlFile } from "../../lib/files";
import { IUserDelivery } from "../../types";

function ActionButton({
  color,
  Icon,
  onClick,
  size,
}: {
  color: string;
  Icon: IconType;
  onClick: () => void;
  size?: number;
}) {
  return (
    <button onClick={onClick}>
      <Icon
        className={`${color} transition-all duration-100 ease-in-out hover:scale-125`}
        size={size}
      />
    </button>
  );
}

type Props = {
  delivery: IUserDelivery;
  onUpdate: () => void;
};

export function UserDeliveryRow({ delivery, onUpdate }: Props) {
  if (!delivery.user) {
    throw new Error("User is undefined");
  }

  const urlfile = useUrlFile();
  const idDelivery = delivery.deliveryId;

  const openFile = useOpenFile();

  const { response, callback } = useAxios({
    url: `deliveries/update-status/${idDelivery}`,
    method: "POST",
  });

  const date = useMemo(() => {
    const dateFormatter = new Intl.RelativeTimeFormat("es", {
      style: "long",
      numeric: "auto",
    });

    let dateString = dateFormatter.format(
      Math.floor(
        (new Date().getTime() - new Date(delivery.dateDelivery).getTime()) /
          (1000 * 60 * 60 * 24),
      ),
      "day",
    );

    // capitalize first letter
    dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);

    return dateString;
  }, [delivery.dateDelivery]);

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
        const bool = statusChange === "Aceptado" ? true : false;
        callback({
          statusChange: bool,
          userId: delivery.user?.id,
        });
      }
    });
  }

  useEffect(() => {
    if (response) {
      Swal.fire(
        `¡Éxito!`,
        `El entregable ha sido actualizado.`,
        "success",
      ).then(() => {
        onUpdate();
      });
    }
  }, [response]);

  return (
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell
        align="center"
        className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
      >
        <div className="flex justify-center">
          <img
            className="mx-2 h-10 w-10 rounded-full"
            src={urlfile(delivery.user?.imageUrl || "default.png")}
            alt="Rounded avatar"
          ></img>
          <div className="mt-2 text-base">
            {delivery.user?.name + " " + delivery?.user?.lastName}
          </div>
        </div>
      </Table.Cell>

      <Table.Cell align="center">{delivery.user?.email}</Table.Cell>

      <Table.Cell align="center">
        {delivery.status === "Aceptado" ? (
          <div className="inline-block rounded-full bg-green-500 py-1 px-2 font-bold text-white">
            {delivery.status}
          </div>
        ) : (
          <div className=" inline-block rounded-full bg-red-500  py-1  px-2 font-bold text-white">
            {delivery.status}
          </div>
        )}
      </Table.Cell>
      <Table.Cell align="center">{date}</Table.Cell>
      <Table.Cell align="center">
        <div className="grid w-3/4 grid-cols-3 items-center justify-center ">
          <div className="cursor-pointer transition-all ease-in-out active:scale-95">
            <ActionButton
              color="text-gnp-blue-700"
              Icon={FiEye}
              onClick={() => openFile(delivery.fileUrl)}
              size={25}
            />
          </div>
          <div className="cursor-pointer transition-all ease-in-out hover:scale-125 active:scale-95">
            <FiCheck
              size={25}
              className="text-green-500"
              onClick={() => handleUpdate("Aceptado")}
            />
          </div>
          <div className="cursor-pointer transition-all ease-in-out hover:scale-125 active:scale-95">
            <FiX
              size={25}
              className="text-red-500"
              onClick={() => handleUpdate("Rechazado")}
            />
          </div>
        </div>
      </Table.Cell>
    </Table.Row>
  );
}
