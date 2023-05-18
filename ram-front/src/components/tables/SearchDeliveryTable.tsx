import { Table } from "flowbite-react";
import { useState } from "react";
import { SearchDeliveryRow } from "./SearchDeliveryRow";
import { IDelivery } from "../../types";
// (c) Delta Software 2023, rights reserved.>

export interface IListSalesProps {
  deliveries: IDelivery[];
  onReloadDeliveries: () => void;
}

export default function SearchDeliveryTable({
  deliveries,
  onReloadDeliveries,
}: IListSalesProps) {
  const [search, setSearch] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const data = {
    nodes: deliveries.filter((item) =>
      item.deliveryName.toLowerCase().includes(search.toLowerCase()),
    ),
  };

  return (
    <>
      <label htmlFor="search">
        <input
          id="search"
          type="text"
          onChange={handleSearch}
          className="mb-6 h-8 w-1/2 rounded-lg border-2 border-gnp-gray-ligth pl-3 text-base shadow-lg"
          placeholder="Busqueda por entregables..."
        />
      </label>
      <Table className="row" hoverable={true}>
        <Table.Head className="border-2 border-gray-300">
          <Table.HeadCell className="bg-gray-300"></Table.HeadCell>
          <Table.HeadCell className="bg-gray-300"></Table.HeadCell>
          <Table.HeadCell className="bg-gray-300">
            Nombre del entregable:
          </Table.HeadCell>
          <Table.HeadCell className="bg-gray-300">Acciones</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {data.nodes.length > 0 ? (
            data.nodes.map((node, index) => (
              <SearchDeliveryRow
                delivery={node}
                key={index}
                onReloadDeliveries={onReloadDeliveries}
              />
            ))
          ) : (
            <p className="text-center">No hay entregables en el grupo</p>
          )}
        </Table.Body>
      </Table>
    </>
  );
}
