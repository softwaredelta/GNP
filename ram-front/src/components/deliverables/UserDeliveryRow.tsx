// (c) Delta Software 2023, rights reserved.

import { Table } from "flowbite-react";
import { IUserDelivery } from "../../types";
import { useMemo } from "react";
import { FaTrash } from "react-icons/fa";

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
      <Table.Cell>
        <FaTrash className="text-red-500" />
      </Table.Cell>
    </Table.Row>
  );
}
