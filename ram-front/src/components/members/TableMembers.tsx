// (c) Delta Software 2023, rights reserved.

import { Table } from "flowbite-react";
import { IMembers } from "../../types";
import RowMember from "./RowMember";

export interface IListMembersProps {
  members: IMembers[];
}

export default function TableMembers({
  members,
}: IListMembersProps): JSX.Element {
  if (members.length === 0) return <h1>No hay miembros</h1>;

  return (
    <div>
      <div data-testid="Table" className="w-full p-8">
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell align="center">Nombre</Table.HeadCell>
            <Table.HeadCell align="center">Rol</Table.HeadCell>
            <Table.HeadCell align="center">Estado</Table.HeadCell>
            <Table.HeadCell align="center">Perfil</Table.HeadCell>
            <Table.HeadCell align="center">Resumen</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {members.length === 0 && (
              <div className="text-center">No hay ventas para verificar</div>
            )}
            {members.map((member) => {
              return (
                <RowMember
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  lastName={member.lastName}
                  imageUrl={member.imageUrl}
                  rol={member.rol}
                  state={member.state}
                />
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
