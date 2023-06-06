// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=716285224
// * M5_S05

import { Table } from "flowbite-react";
import "react-datepicker/dist/react-datepicker.css";
import { RiFileExcel2Fill } from "react-icons/ri";
import useAxios from "../../hooks/useAxios";

type Props = {
  id: string;
  link: string;
  name: string;
  lastName?: string;
  urlPP200?: string;
  handleOnClick?: (id: string) => void;
};

export default function FunnelRow({
  id,
  name,
  link,
  lastName,
  urlPP200,
  handleOnClick,
}: Props) {
  const { response: prospects } = useAxios<number>({
    url: `prospect/count-prospects-new/${id}`,
    method: "GET",
  });

  const propspectsCount = prospects ? prospects : 0;
  return (
    <Table.Row
      onClick={() => handleOnClick && handleOnClick(id)}
      key={id}
      className="transitions-all bg-white ease-in-out hover:cursor-pointer hover:bg-gray-300  dark:border-gray-700 dark:bg-gray-800 "
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
        {urlPP200 ? (
          <RiFileExcel2Fill
            size={20}
            className="transition-all  duration-300 ease-in-out hover:scale-125 hover:fill-green-500"
            onClick={(event) => {
              event.stopPropagation();
              window.open(link, "_blank");
            }}
          />
        ) : (
          <button disabled>
            <RiFileExcel2Fill
              size={20}
              className="cursor-not-allowed"
              onClick={(event) => {
                event.stopPropagation();
              }}
            />
          </button>
        )}
      </Table.Cell>
    </Table.Row>
  );
}
