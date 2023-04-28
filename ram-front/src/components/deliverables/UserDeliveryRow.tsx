// (c) Delta Software 2023, rights reserved.

import { Table } from "flowbite-react";
import { IUserDelivery } from "../../types";
import { useMemo } from "react";
import { ImCross, ImCheckmark } from "react-icons/im";
import { type IconType } from "react-icons/lib";

const actionIconSize = 20;

function ActionButton({
  color,
  Icon,
  onClick,
}: {
  color: string;
  Icon: IconType;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick}>
      <Icon
        className={`${color} hover:scale-125 transition-all ease-in-out duration-100`}
        size={actionIconSize}
      />
    </button>
  );
}

export function UserDeliveryRow({
  dateDelivery,
  fileURL,
  status,
  user,
}: IUserDelivery) {
  if (!user) {
    throw new Error("User is undefined");
  }

  const date = useMemo(() => {
    const dateFormatter = new Intl.RelativeTimeFormat("es", {
      style: "long",
      numeric: "auto",
    });

    let dateString = dateFormatter.format(
      Math.floor(
        (new Date(dateDelivery).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      ),
      "day",
    );

    // capitalize first letter
    dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);

    return dateString;
  }, [dateDelivery]);

  return (
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        <img
          className="w-14 h-14 rounded-full"
          src={user.imageURL}
          alt="Rounded avatar"
        />
      </Table.Cell>
      <Table.Cell>{user.email}</Table.Cell>

      <Table.Cell>{status}</Table.Cell>
      <Table.Cell>Archivo</Table.Cell>
      <Table.Cell>{date}</Table.Cell>
      <Table.Cell className="items-center justify-center h-full">
        <div className="flex flex-row gap-5 justify-around">
          <ActionButton
            color="text-green-500"
            Icon={ImCheckmark}
            onClick={() => {
              alert("Aceptando...");
            }}
          />
          <ActionButton
            color="text-red-500"
            Icon={ImCross}
            onClick={() => {
              alert("Rechazando...");
            }}
          />
        </div>
      </Table.Cell>
    </Table.Row>
  );
}
