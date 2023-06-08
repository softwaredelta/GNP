// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=716285224
// * M5_S05
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=790712334
// * M5_S06
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1402812805
// * M5_S08

import { Table } from "flowbite-react";
import "react-datepicker/dist/react-datepicker.css";
import useSearch from "../../hooks/useSearch";
import { IUser } from "../../types";
import FunnelRow from "./FunnelRow";
import useSearch from "../../hooks/useSearch";

interface Props {
  agents: IUser[];
  handleOnClick?: (id: string) => void;
}

const FunnelProspect = ({ agents, handleOnClick }: Props) => {
  const { handleSearch, data } = useSearch({
    info: agents.map((agent) => ({
      ...agent,
      fullName: `${agent.name} ${agent.lastName}`,
    })),
    key: "fullName",
  });

  return (
    <div className="mt-8 flex flex-col items-center justify-center">
      <div className="mx-auto grid w-10/12 grid-cols-1">
        <label htmlFor="search">
          <input
            id="search"
            type="text"
            onChange={handleSearch}
            className="mb-6 h-8 w-1/4 rounded-lg border-2 border-gnp-gray-ligth pl-3 text-base shadow-lg"
            placeholder="Busqueda por agentes..."
          />
        </label>
      </div>
      <div
        data-testid="funnel-table"
        className="grid-row grid w-full px-8 pb-4"
      >
        <Table className="row" hoverable={true}>
          <Table.Head>
            <Table.HeadCell align="center">Nombre de agente</Table.HeadCell>
            <Table.HeadCell align="center">
              Prospectos calificados
            </Table.HeadCell>
            <Table.HeadCell align="center">Citas agendadas</Table.HeadCell>
            <Table.HeadCell align="center">Citas efectivas</Table.HeadCell>
            <Table.HeadCell align="center">Solicitudes</Table.HeadCell>
            <Table.HeadCell align="center">Poliza pagada</Table.HeadCell>
            <Table.HeadCell align="center">PP200</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {data.map((agent: IUser) => {
              return (
                <FunnelRow
                  key={agent.id}
                  id={agent.id as string}
                  name={agent.name}
                  lastName={agent.lastName}
                  link={agent.urlPP200 as string}
                  handleOnClick={handleOnClick}
                  urlPP200={agent.urlPP200 as string}
                />
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default FunnelProspect;
