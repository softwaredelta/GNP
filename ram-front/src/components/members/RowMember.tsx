// (c) Delta Software 2023, rights reserved.

import { Table } from "flowbite-react";
import { AiOutlineEye } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";

export interface MembersCardProps {
  id: string;
  rol: string;
  name: string;
  lastName: string;
  state: number;
  imageUrl: string;
}

export default function RowMember({
  id,
  rol,
  name,
  lastName,
  state,
  imageUrl,
}: MembersCardProps): JSX.Element {
  return (
    <Table.Row
      key={id}
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <Table.Cell
        className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
        align="center"
      >
        <div className="flex justify-start">
          <img
            className="mx-2 h-10 w-10 rounded-full"
            src={imageUrl}
            alt="Rounded avatar"
          ></img>
          <div className=" mt-2 text-base">{name + " " + lastName}</div>
        </div>
      </Table.Cell>
      <Table.Cell align="center">{rol}</Table.Cell>
      <Table.Cell align="center">{state ? "Activo" : "Inactivo"}</Table.Cell>
      <Table.Cell align="center">
        <div className=" grid grid-cols-2 ">
          <div className="cursor-pointer transition-all ease-in-out hover:scale-125 active:scale-95">
            <AiOutlineEye
              size={20}
              className="text-gray-500"
              onClick={() => {
                alert("Ver perfil");
              }}
            />
          </div>
          <div className="cursor-pointer transition-all ease-in-out hover:scale-125 active:scale-95">
            <FaEdit
              onClick={() => {
                alert("Ver perfil");
              }}
              color="gray"
              size={20}
              className="hover:scale-105 hover:fill-blue-700"
            />
          </div>
        </div>
      </Table.Cell>
      <Table.Cell align="center">
        {rol === "Agente" ? (
          <button
            onClick={() => {
              alert("Ver resumen");
            }}
            className="btn-primary"
          >
            Ver resumen
          </button>
        ) : (
          <button
            onClick={() => {
              alert("No disponible para gerentes");
            }}
            className="btn-disabled"
          >
            Ver resumen
          </button>
        )}
      </Table.Cell>
    </Table.Row>
  );
}
