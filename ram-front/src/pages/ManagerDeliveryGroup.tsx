// (c) Delta Software 2023, rights reserved.
import Wrapper from "../containers/Wrapper";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { IDeliveryDescription, ILink } from "../types";
import EditDeliveryForm from "../components/forms/EditDeliveryForm";
import Swal from "sweetalert2";

export default function ManagerDeliveryGroup(): JSX.Element {
  const { id } = useParams();

  const { response: delivery } = useAxios<IDeliveryDescription>({
    url: `deliveries/group-delivery/${id}`,
    method: "GET",
  });

  const {
    response: newLink,
    error: newLinkError,
    callback: newLinkCallback,
  } = useAxios<ILink>({
    url: `deliveries/create-delivery-link/${id}`,
    method: "POST",
  });

  const {
    response: editLink,
    error: editLinkError,
    callback: editLinkCallback,
  } = useAxios<ILink>({
    url: `deliveries/update-delivery-link`,
    method: "POST",
  });

  const {
    response: deleteLink,
    error: deleteLinkError,
    callback: deleteLinkCallback,
  } = useAxios<ILink>({
    url: `deliveries/delete-delivery-link`,
    method: "POST",
  });

  useEffect(() => {
    if (newLink || editLink || deleteLink) {
      Swal.fire({
        title: "¡Éxito!",
        text: "El cambio a la lista de links se ha realizado correctamente.",
        icon: "success",
      });
    } else if (newLinkError) {
      Swal.fire({
        title: "¡Error!",
        text: `Ocurrió un error al añadir el link.\n
        ${(newLinkError as any).response.data.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } else if (editLinkError) {
      Swal.fire({
        title: "¡Error!",
        text: `Ocurrió un error al editar el link.\n
        ${(newLinkError as any).response.data.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } else if (deleteLinkError) {
      Swal.fire({
        title: "¡Error!",
        text: `Ocurrió un error al eliminar el link.\n
        ${(newLinkError as any).response.data.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [
    newLink,
    editLink,
    deleteLink,
    newLinkError,
    editLinkError,
    deleteLinkError,
  ]);

  return (
    <Wrapper title={"Editando entregable: " + delivery?.deliveryName || ""}>
      <div className="w-full rounded-3xl px-10">
        {delivery && id && (
          <EditDeliveryForm
            delivery={delivery}
            deliveryId={id}
            handleLinkPost={({ link, name }) => {
              newLinkCallback?.({ link, name });
            }}
            handleLinkEdit={({ link, name, id: idLink }) => {
              editLinkCallback?.({ link, name, idLink });
            }}
            handleLinkDelete={(idLink) => {
              deleteLinkCallback?.({ idLink });
            }}
          />
        )}
      </div>
    </Wrapper>
  );
}
