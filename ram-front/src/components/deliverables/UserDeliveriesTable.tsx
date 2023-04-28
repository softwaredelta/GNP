// (c) Delta Software 2023, rights reserved.
import { Table } from "flowbite-react";
import { IUserDelivery } from "../../types";
import { UserDeliveryRow } from "./UserDeliveryRow";

interface Props {
  userDeliveries: IUserDelivery[];
}

export function UserDeliveriesTable({ userDeliveries }: Props) {
  if (userDeliveries.length === 0) return <h1>No hay entregables</h1>;

  return (
    <div data-testid="Table" className="w-full p-8">
      <Table hoverable={true}>
        <Table.Head>
          <Table.HeadCell>Agente</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell>Estado</Table.HeadCell>
          <Table.HeadCell>Entregable</Table.HeadCell>
          <Table.HeadCell>Fecha de Subida</Table.HeadCell>
          <Table.HeadCell>Acciones</Table.HeadCell>
        </Table.Head>

        <Table.Body className="divide-y">
          {userDeliveries.map((delivery, index) => {
            return (
              <UserDeliveryRow
                key={index}
                status={delivery.status}
                fileURL={delivery.fileURL}
                dateDelivery={delivery.dateDelivery}
                user={delivery.user}
              />
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
