// (c) Delta Software 2023, rights reserved.

import "react-datepicker/dist/react-datepicker.css";
import { Table } from "flowbite-react";
import { RiFileExcel2Fill } from "react-icons/ri";
import useAxios from "../../hooks/useAxios";

type Props = {
  id: string;
  email: string;
};

export default function FunnelRow({ id, email }: Props) {
  const { response: prospects } = useAxios({
    url: `prospect/count-prospects-new/${id}`,
    method: "GET",
  });
  const cellStyle = {
    backgroundColor:
      prospects < 50 ? "red" : prospects >= 50 ? "green" : undefined,
    borderRadius: "70px",
    color: "white",
  };
  const cellStyleCitA = {
    backgroundColor:
      prospects < prospects * 0.48
        ? "red"
        : prospects >= prospects * 0.48
        ? "green"
        : undefined,
    borderRadius: "70px",
    color: "white",
  };
  const cellStyleCitE = {
    backgroundColor:
      prospects < prospects * 0.4
        ? "red"
        : prospects >= prospects * 0.4
        ? "green"
        : undefined,
    borderRadius: "70px",
    color: "white",
  };
  const cellStyleSV = {
    backgroundColor:
      prospects < prospects * 0.08
        ? "red"
        : prospects >= prospects * 0.08
        ? "green"
        : undefined,
    borderRadius: "70px",
    color: "white",
  };
  const cellStylePp = {
    backgroundColor:
      prospects < prospects * 0.04
        ? "red"
        : prospects >= prospects * 0.04
        ? "green"
        : undefined,
    borderRadius: "70px",
    color: "white",
  };

  return (
    <Table.Row
      key={id}
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <Table.Cell
        className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
        align="center"
      >
        {email}
      </Table.Cell>
      <Table.Cell align="center" style={cellStyle}>
        {prospects}
      </Table.Cell>
      <Table.Cell align="center" style={cellStyleCitA}>
        {(prospects * 0.48).toFixed(0)}
      </Table.Cell>
      <Table.Cell align="center" style={cellStyleCitE}>
        {(prospects * 0.4).toFixed(0)}
      </Table.Cell>
      <Table.Cell align="center" style={cellStyleSV}>
        {(prospects * 0.08).toFixed(0)}
      </Table.Cell>
      <Table.Cell align="center" style={cellStylePp}>
        {(prospects * 0.04).toFixed(0)}
      </Table.Cell>
      <Table.Cell align="center">
        <RiFileExcel2Fill className=" hover:scale-105 hover:fill-green-500" />
      </Table.Cell>
    </Table.Row>
  );
}
