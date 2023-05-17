// (c) Delta Software 2023, rights reserved.

import "react-datepicker/dist/react-datepicker.css";
import { Table } from "flowbite-react";
import { RiFileExcel2Fill } from "react-icons/ri";
import useAxios from "../../hooks/useAxios";
import { useNavigate } from "react-router-dom";

type Props = {
  id: string;
  email: string;
};

export default function FunnelRow({ id, email }: Props) {
  const { response: prospects } = useAxios<number>({
    url: `prospect/count-prospects-new/${id}`,
    method: "GET",
  });

  const navigate = useNavigate();

  const propspectsCount = prospects ? prospects : 0;
  return (
    <Table.Row
      key={id}
      onClick={() => navigate(`/prospects/agent/${id}`)}
      className="bg-white hover:cursor-pointer dark:border-gray-700 dark:bg-gray-800"
    >
      <Table.Cell
        className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
        align="center"
      >
        {email}
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
        <RiFileExcel2Fill className=" hover:scale-105 hover:fill-green-500" />
      </Table.Cell>
    </Table.Row>
  );
}
