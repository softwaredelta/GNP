// (c) Delta Software 2023, rights reserved.

import "react-datepicker/dist/react-datepicker.css";
import { Table } from "flowbite-react";
import { RiFileExcel2Fill } from "react-icons/ri";
import useAxios from "../../hooks/useAxios";

type Props = {
  id: string;
  link: string;
  name: string;
  lastName?: string;
};

export default function FunnelRow({ id, name, link, lastName }: Props) {
  const { response: prospects } = useAxios<number>({
    url: `prospect/count-prospects-new/${id}`,
    method: "GET",
  });

  const propspectsCount = prospects ? prospects : 0;
  return (
    <Table.Row
      key={id}
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <Table.Cell
        className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
        align="center"
      >
        {name} {lastName}
      </Table.Cell>
      <Table.Cell align="center">{prospects}</Table.Cell>
      <Table.Cell align="center">
        {(propspectsCount * 0.48).toFixed(0)}
      </Table.Cell>
      <Table.Cell align="center">
        {(propspectsCount * 0.4).toFixed(0)}
      </Table.Cell>
      <Table.Cell align="center">
        {(propspectsCount * 0.08).toFixed(0)}
      </Table.Cell>
      <Table.Cell align="center">
        {(propspectsCount * 0.04).toFixed(0)}
      </Table.Cell>
      <Table.Cell align="center">
        <a href={link} target="_blank" rel="noopener noreferrer">
          <RiFileExcel2Fill
            size={20}
            className="transition-all  duration-300 ease-in-out hover:scale-125 hover:fill-green-500"
          />
        </a>
      </Table.Cell>
    </Table.Row>
  );
}
