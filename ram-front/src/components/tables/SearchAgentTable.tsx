import { Table } from "flowbite-react";
import { useState } from "react";
import { IUserName } from "../../types";
import { SearchAgentRow } from "./SearchAgentRow";
// (c) Delta Software 2023, rights reserved.>

export interface IListSearchProps {
  agents: IUserName[];
}

export default function SearchAgentTable({ agents }: IListSearchProps) {
  const [search, setSearch] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const data = {
    nodes: agents.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    ),
  };

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
              <SearchAgentRow agent={node} key={index} />
            ))
          ) : (
            <p className="text-center">No hay agentes en el grupo</p>
          )}
        </Table.Body>
      </Table>
    </>
  );
}
