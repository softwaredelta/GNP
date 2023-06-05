// (c) Delta Software 2023, rights reserved.

import { Table } from "flowbite-react";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useUrlFile } from "../../lib/files";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";
import { useEffect } from "react";

export interface MembersCardProps {
  id: string;
  rol: string;
  name: string;
  lastName: string;
  isActive: number;
  imageUrl: string;
  email: string;
  updateMembers: () => void;
}

export default function RowMember({
  id,
  rol,
  name,
  lastName,
  isActive,
  imageUrl,
  email,
  updateMembers,
}: MembersCardProps): JSX.Element {
  const urlfile = useUrlFile();

  const { response, error, callback } = useAxios({
    url: `user/delete/${id}`,
    method: "POST",
  });

  useEffect(() => {
    if (response) updateMembers();
  }, [response, updateMembers]);

  function handleDelete() {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed && callback) {
        callback();
      }
    });

    if (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el usuario.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  }

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
        <div className=" grid grid-cols-3 gap-2">
          <div className="cursor-pointer transition-all ease-in-out hover:scale-125 active:scale-95">
            <Link to={`/view-profile/${id}`}>
              <FiEye
                size={20}
                className="text-gray-500 hover:stroke-gnp-blue-900"
              />
            </Link>
          </div>
          <div className="cursor-pointer transition-all ease-in-out hover:scale-125 active:scale-95">
            <Link to={`/profile/${id}`}>
              <FiEdit
                color="gray"
                size={20}
                className="hover:scale-105 hover:stroke-gnp-blue-300"
              />
            </Link>
          </div>
          {isActive === 1 ? (
            <div className="cursor-pointer transition-all ease-in-out hover:scale-125 active:scale-95">
              <button onClick={() => handleDelete()}>
                <FiTrash2
                  color="gray"
                  size={20}
                  className="hover:scale-105 hover:stroke-red-800"
                />
              </button>
            </div>
          ) : (
            <button disabled>
              <FiTrash2 color="gray" size={20} className="cursor-not-allowed" />
            </button>
          )}
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
