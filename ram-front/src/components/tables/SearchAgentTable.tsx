import { Table } from "flowbite-react";
import { useCallback, useState } from "react";
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
  const [search, setSearch] = useState("");
  const accessToken = useRecoilValue(accessToken$);
  const apiBase = useRecoilValue(apiBase$);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const data = {
    nodes: agents.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    ),
  };

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
          agent.id,
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
      <label htmlFor="search">
        <input
          id="search"
          type="text"
          onChange={handleSearch}
          className="mb-6 h-8 rounded-lg border-2 border-gnp-gray-ligth pl-3 text-base shadow-lg"
          placeholder="Busqueda por agentes..."
        />
      </label>
      <Table className="row" hoverable={true}>
        <Table.Head className="border-2 border-gray-300">
          <Table.HeadCell className="bg-gray-300"></Table.HeadCell>
          <Table.HeadCell className="bg-gray-300"></Table.HeadCell>
          <Table.HeadCell className="bg-gray-300">
            Nombre del Agente
          </Table.HeadCell>
          <Table.HeadCell className="bg-gray-300">Acciones</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {data.nodes.length > 0 ? (
            data.nodes.map((node, index) => (
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
