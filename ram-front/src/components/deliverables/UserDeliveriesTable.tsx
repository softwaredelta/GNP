// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=840613660
// * M1_S06
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=95397343
// * M1_S07
import { Table } from "flowbite-react";
import { IUserDelivery } from "../../types";
import { UserDeliveryRow } from "./UserDeliveryRow";
import { useEffect, useState } from "react";

interface Props {
  userDeliveries: IUserDelivery[];
  onUpdate: () => void;
}

export function UserDeliveriesTable({ userDeliveries, onUpdate }: Props) {
  const [data, setData] = useState<IUserDelivery[]>(userDeliveries);

  useEffect(() => {
    setData(userDeliveries);
  }, [userDeliveries]);

  return (
    <div data-testid="Table" className="w-full">
      <Table hoverable={true}>
        <Table.Head>
          <Table.HeadCell align="center">Agente</Table.HeadCell>
          <Table.HeadCell align="center">Correo </Table.HeadCell>
          <Table.HeadCell align="center">Estado</Table.HeadCell>
          <Table.HeadCell align="center">Fecha de Subida</Table.HeadCell>
          <Table.HeadCell align="center">Acciones</Table.HeadCell>
        </Table.Head>

        <Table.Body className="divide-y">
          {data.map((delivery, index) => {
            return (
              <UserDeliveryRow
                key={index}
                delivery={delivery}
                onUpdate={() => {
                  onUpdate();
                }}
              />
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
