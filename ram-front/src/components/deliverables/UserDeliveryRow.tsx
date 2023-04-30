// (c) Delta Software 2023, rights reserved.

import { Table } from "flowbite-react";
import { IUserDelivery } from "../../types";
import { useMemo } from "react";
import { RiFileSearchFill } from "react-icons/ri";
import { type IconType } from "react-icons/lib";
import { FcCheckmark } from "react-icons/fc";
import { RxCross1 } from "react-icons/rx";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";

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
        className={`${color} hover:scale-125 transition-all ease-in-out duration-100`}
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

  const idDelivery = delivery.deliveryId;

  const { callback } = useAxios({
    url: `deliveries/update-status/${idDelivery}`,
    method: "POST",
    body: {},
  });

  const date = useMemo(() => {
    const dateFormatter = new Intl.RelativeTimeFormat("es", {
      style: "long",
      numeric: "auto",
    });

    let dateString = dateFormatter.format(
      Math.floor(
        (new Date(delivery.dateDelivery).getTime() - new Date().getTime()) /
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
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed && callback) {
        const bool = statusChange === "aceptado" ? true : false;
        callback({
          statusChange: bool,
          userId: delivery.user?.id,
        });
        Swal.fire(
          `¡${statusChange}!`,
          `El entregable ha sido ${statusChange}`,
          "success",
        ).then(() => {
          onUpdate();
        });
      }
    });
  }

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
        const bool = statusChange === "aceptado" ? true : false;
        callback({
          statusChange: bool,
          userId: user?.id,
        });
        Swal.fire(
          `¡${statusChange}!`,
          `El entregable ha sido ${statusChange}`,
          "success",
        ).then(() => {
          console.log(user?.id, idDelivery);
        });
      }
    });
  }

  return (
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        <img
          className="w-10 h-10 rounded-full"
          src={delivery.user.imageURL}
          alt="Rounded avatar"
        />
      </Table.Cell>
      <Table.Cell>{delivery.user.email}</Table.Cell>

      <Table.Cell>{delivery.status}</Table.Cell>
      <Table.Cell>
        <ActionButton
          color="text-gnp-blue-700"
          Icon={RiFileSearchFill}
          onClick={() => {
            const url = new URL("http://localhost:8080/files");
            url.searchParams.append("fileUrl", delivery.fileUrl);
            window.open(url.toString(), "_blank");
          }}
          size={30}
        />
      </Table.Cell>
      <Table.Cell>{date}</Table.Cell>
      <Table.Cell>
        <div className="grid grid-cols-3 items-center justify-center ">
          <div className="hover:scale-125 transition-all ease-in-out active:scale-95 cursor-pointer">
            <FcCheckmark
              size={20}
              className="text-green-500"
              onClick={() => handleUpdate("aceptado")}
            />
          </div>
          <div className="hover:scale-125 transition-all ease-in-out active:scale-95 cursor-pointer">
            <RxCross1
              size={20}
              className="text-red-500"
              onClick={() => handleUpdate("rechazado")}
            />
          </div>
        </div>
      </Table.Cell>
    </Table.Row>
  );
}
