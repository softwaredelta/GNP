import { Table } from "flowbite-react";
import { useCallback } from "react";
import { IUser } from "../../types";
import { SearchAgentRow } from "./SearchAgentRow";
import Swal from "sweetalert2";
import { accessToken$ } from "../../lib/api/api-auth";
import { useRecoilValue } from "recoil";
import { apiBase$ } from "../../lib/api/api-base";
// (c) Delta Software 2023, rights reserved.>

export interface IListSearchProps {
  agents: IUser[];
  groupId: string;
  onReloadAgents: () => void;
}

export default function SearchAgentTable({
  agents,
  groupId,
  onReloadAgents,
}: IListSearchProps) {
  const accessToken = useRecoilValue(accessToken$);
  const apiBase = useRecoilValue(apiBase$);

  const deleteAgent = useCallback(
    async (agent: IUser) => {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) {
        return;
      }

      const response = await fetch(
        `${apiBase}/groups/${groupId}/remove-user?userId=${encodeURIComponent(
          agent.id as string,
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        Swal.fire(
          "Error",
          "No se pudo eliminar el agente. Por favor intenta más tarde.",
          "error",
        );
      } else {
        onReloadAgents();
      }
    },
    [accessToken, apiBase, groupId, onReloadAgents],
  );

  return (
    <>
      <Table className="row" hoverable={true}>
        <Table.Head className="border-2 border-gray-300">
          <Table.HeadCell className="bg-gray-300"></Table.HeadCell>
          <Table.HeadCell className="bg-gray-300">
            Nombre del Agente
          </Table.HeadCell>
          <Table.HeadCell className="bg-gray-300">Acciones</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {agents.length > 0 ? (
            agents.map((node, index) => (
              <SearchAgentRow
                agent={node}
                key={index}
                deleteAgent={() => deleteAgent(node)}
              />
            ))
          ) : (
            <p className="text-center">No hay agentes en el grupo</p>
          )}
        </Table.Body>
      </Table>
    </>
  );
}
