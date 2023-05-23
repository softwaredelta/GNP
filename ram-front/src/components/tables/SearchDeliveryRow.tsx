// (c) Delta Software 2023, rights reserved.
import { Table } from "flowbite-react";
import { useCallback } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useRecoilValue } from "recoil";
import Swal from "sweetalert2";
import useModal from "../../hooks/useModal";
import { accessToken$ } from "../../lib/api/api-auth";
import { apiBase$ } from "../../lib/api/api-base";
import { useUrlFile } from "../../lib/files";
import { IDelivery } from "../../types";
import ModalDeliveryFormUpdate from "../forms/ModalDeliveryFormUpdate";

export interface IListSalesProps {
  delivery: IDelivery;
  onReloadDeliveries: () => void;
}
export const SearchDeliveryRow = ({
  delivery,
  onReloadDeliveries,
}: IListSalesProps) => {
  const fileUrl = useUrlFile();

  const deliveryID = delivery.id;
  const accessToken = useRecoilValue(accessToken$);
  const apiBase = useRecoilValue(apiBase$);
  const { isOpen: isOpenDeliveryForm, toggleModal: toggleModalDeliveryForm } =
    useModal();

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
            onClick={toggleModalDeliveryForm}
          >
            <FiEdit
              color="gray"
              size={20}
              className="hover:stroke-gnp-blue-900"
            />
          </button>
          <ModalDeliveryFormUpdate
            isOpenModal={isOpenDeliveryForm}
            closeModal={() => {
              toggleModalDeliveryForm();
              onReloadDeliveries();
            }}
            initialValues={delivery}
            deliveryId={delivery.id}
          />
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
