// (c) Delta Software 2023, rights reserved.

import "react-datepicker/dist/react-datepicker.css";
import { Table } from "flowbite-react";
import { IUser } from "../../types";
import FunnelRow from "./FunnelRow";

interface Props {
  agents: IUser[];
}

const FunnelProspect = ({ agents }: Props) => {
  return (
    <div className="mt-8 flex flex-col items-center justify-center">
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
            <Table.HeadCell align="center">Solicitudes de vida</Table.HeadCell>
            <Table.HeadCell align="center">Poliza pagada</Table.HeadCell>
            <Table.HeadCell align="center">PP200</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {agents.map((agent) => {
              return (
                <FunnelRow
                  key={agent.id}
                  id={agent.id as string}
                  email={agent.email}
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
