// (c) Delta Software 2023, rights reserved.

import { Table } from "flowbite-react";
import { AiOutlineEye } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useUrlFile } from "../../lib/files";

export interface MembersCardProps {
  id: string;
  rol: string;
  name: string;
  lastName: string;
  isActive: number;
  imageUrl: string;
  email: string;
}

export default function RowMember({
  id,
  rol,
  name,
  lastName,
  isActive,
  imageUrl,
  email,
}: MembersCardProps): JSX.Element {
  const urlfile = useUrlFile();
  return (
    <Table.Row
      key={id}
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <Table.Cell
        className="font-medium text-gray-900 dark:text-white"
        align="right"
      >
        <div className="flex">
          <img
            className="mx-2 h-10 w-10 rounded-full"
            src={urlfile(imageUrl)}
            alt="Rounded avatar"
          ></img>
          <div className="mt-2 text-base">{name + " " + lastName}</div>
        </div>
      </Table.Cell>
      <Table.Cell align="center">{email}</Table.Cell>
      <Table.Cell align="center">
        {rol === "regular" ? (
          <div className="inline-block rounded-full bg-orange-500 py-1 px-2 font-bold text-white">
            {"Agente"}
          </div>
        ) : (
          <div className=" inline-block rounded-full bg-gnp-blue-600  py-1  px-2 font-bold text-white">
            {"Gerente"}
          </div>
        )}
      </Table.Cell>
      <Table.Cell align="center">
        {isActive === 1 ? (
          <div className="inline-block rounded-full bg-green-400 py-1 px-2 font-bold text-white">
            {"Activo"}
          </div>
        ) : (
          <div className=" inline-block rounded-full bg-red-400  py-1  px-2 font-bold text-white">
            {"Inactivo"}
          </div>
        )}
      </Table.Cell>
      <Table.Cell align="center">
        <div className=" grid grid-cols-2 ">
          <div className="cursor-pointer transition-all ease-in-out hover:scale-125 active:scale-95">
            <Link to={`/view-profile/${id}`}>
              <AiOutlineEye size={24} className="text-gray-500" />
            </Link>
          </div>
          <div className="cursor-pointer transition-all ease-in-out hover:scale-125 active:scale-95">
            <Link to={`/profile/${id}`}>
              <FiEdit color="gray" size={20} className="hover:scale-105" />
            </Link>
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
