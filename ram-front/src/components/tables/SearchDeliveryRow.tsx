import { Checkbox, Table } from "flowbite-react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IDelivery } from "../../types";
import { useUrlFile } from "../../lib/files";
import Swal from "sweetalert2";
import { apiBase$ } from "../../lib/api/api-base";
import { useRecoilValue } from "recoil";
import { accessToken$ } from "../../lib/api/api-auth";
import { useCallback } from "react";
// (c) Delta Software 2023, rights reserved.

export interface IListSalesProps {
  delivery: IDelivery;
  onReloadDeliveries: () => void;
}
export const SearchDeliveryRow = ({
  delivery,
  onReloadDeliveries,
}: IListSalesProps) => {
  const fileUrl = useUrlFile();

  // const { callback } = useAxios({
  //   url: `deliveries/${delivery.id}`,
  //   method: "DELETE",
  //   body: {},
  // });

  const deliveryID = delivery.id;
  const accessToken = useRecoilValue(accessToken$);
  const apiBase = useRecoilValue(apiBase$);

  const deleteDelivery = useCallback(async () => {
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
      `${apiBase}/deliveries/${encodeURIComponent(deliveryID as string)}`,
      {
        method: "DELETE",
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
      Swal.fire(
        "Eliminado",
        "El entregable ha sido eliminado con éxito",
        "success",
      );
      onReloadDeliveries();
    }
  }, [accessToken, apiBase, delivery, onReloadDeliveries]);

  return (
    <>
      <Table.Row key={delivery.id} className="border-2 border-gray-300">
        <Table.Cell>
          <Checkbox className="border-gray-400" />
        </Table.Cell>
        <Table.Cell>
          <img
            className="w-30 h-14 rounded-lg"
            src={fileUrl(delivery.imageUrl)}
            alt="Profile Image"
          />
        </Table.Cell>
        <Table.Cell>{delivery.deliveryName}</Table.Cell>
        <Table.Cell>
          <button
            className="mr-2 cursor-pointer transition-all ease-in-out hover:scale-125"
            onClick={() => alert("Redireccionando a editar delivery ...")}
          >
            <FiEdit
              color="gray"
              size={20}
              className="hover:stroke-gnp-blue-900"
            />
          </button>
          <button
            className="cursor-pointer transition-all ease-in-out hover:scale-125"
            onClick={() => deleteDelivery()}
          >
            <FiTrash2 color="gray" size={20} className="hover:stroke-red-900" />
          </button>
        </Table.Cell>
      </Table.Row>
    </>
  );
};
