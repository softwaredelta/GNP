// (c) Delta Software 2023, rights reserved.

import { Table } from "flowbite-react";
import { IMembers } from "../../types";
import RowMember from "./RowMember";
import useSearch from "../../hooks/useSearch";
import { useEffect, useState } from "react";

export interface IListMembersProps {
  members: IMembers[];
  updateMembers: () => void;
}

export default function TableMembers({
  members,
  updateMembers,
}: IListMembersProps): JSX.Element {
  const [newMembers, setData] = useState<IMembers[]>(members);
  useEffect(() => {
    setData(members);
  }, [members]);

  const { handleSearch, data } = useSearch({
    info: newMembers.map((member) => ({
      ...member,
      fullName: `${member.name} ${member.lastName}`,
    })),
    key: "fullName",
  });

  if (members.length === 0) return <h1>No hay miembros</h1>;

  return (
    <>
      <div className="px-16">
        <label htmlFor="search">
          <input
            id="search"
            type="text"
            onChange={handleSearch}
            className="mb-10 h-8 w-1/4 rounded-lg border-2 border-gnp-gray-ligth pl-3 text-base shadow-lg"
            placeholder="Busqueda por miembros..."
          />
        </label>
      </div>
      <div data-testid="Table" className="grid-row grid w-full px-8 pb-4">
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell align="center">Nombre</Table.HeadCell>
            <Table.HeadCell align="center">Correo</Table.HeadCell>
            <Table.HeadCell align="center">Rol</Table.HeadCell>
            <Table.HeadCell align="center">Estado</Table.HeadCell>
            <Table.HeadCell align="center">Perfil</Table.HeadCell>
            <Table.HeadCell align="center">Resumen</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {newMembers.length === 0 && (
              <div className="text-center">No hay usuarios en el sistema</div>
            )}
            {data.map((member) => {
              return (
                <RowMember
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  lastName={member.lastName}
                  imageUrl={member.imageUrl}
                  rol={member.rol}
                  email={member.email}
                  isActive={member.isActive}
                  updateMembers={updateMembers}
                />
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </>
  );
}
