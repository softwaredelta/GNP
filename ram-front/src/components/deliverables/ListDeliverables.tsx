// (c) Delta Software 2023, rights reserved.
import axios from "axios";
import { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import useModal from "../../hooks/useModal";
import { useAuthentication } from "../../lib/api/api-auth";
import { apiBase$ } from "../../lib/api/api-base";
import { IUserDelivery } from "../../types";
import { Button } from "../button";
import DropZone from "../generics/DropZone";
import Modal from "../generics/Modal";
import DeliveryCard from "../generics/cards/DeliveryCard";

interface Props {
  deliverables: IUserDelivery[];
}

export default function ListDeliverables({ deliverables }: Props) {
  const API_URL = useRecoilValue(apiBase$);
  const { auth } = useAuthentication();
  const [id, setId] = useState<string>("");

  const { isOpen, toggleModal } = useModal();
  const modalFileInput = useRef<HTMLInputElement>(null);
  const [uploadFileURL, setUploadFileURL] = useState<string | null>("");
  const [fileName, setFileName] = useState<string>("");

  const handleModalOpen = (deliveryCardID: string): void => {
    setId(deliveryCardID);
    toggleModal();
  };

  const uploadFile = (): void => {
    const file: File | undefined = modalFileInput.current?.files?.[0];

    if (file) {
      const formData: FormData = new FormData();

      formData.append("file", file);

      try {
        (async (): Promise<void> => {
          const response = await axios.post(
            `${API_URL}/user-delivery/${id}/upload`,

            formData,

            {
              headers: {
                Authorization: `Bearer ${auth?.accessToken}`,
              },
            },
          );

          console.debug(response);

          setUploadFileURL(response.data); //Se guarda la url del archivo en el estado
          setFileName(response.headers.filename); //Se guarda el nombre del archivo en el estado
        })();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (deliverables.length === 0) return <h1>No hay entregables</h1>;

  return (
    <div className="grid grid-cols-1 gap-10 p-12 w-10/12 mx-auto">
      {deliverables.map((elem, index) => {
        if (!elem.delivery) {
          throw new Error("No se encontró la entrega");
        }

        return (
          <>
            <DeliveryCard
              deliveryID={elem.delivery?.id ?? ""}
              onFileSubmit={() => handleModalOpen(elem.delivery?.id ?? "")}
              nameDelivery={elem.delivery.deliveryName}
              image={elem.delivery.imageURL}
              color={index % 2 ? "orange" : "blue"}
              status={elem.status}
            />
            {isOpen && (
              <Modal closeModal={toggleModal}>
                <div className="flex flex-col space-y-5">
                  <h3 className="text-4xl text-gnp-blue-600 font-bold my-4">
                    Sube tu evidencia
                  </h3>
                  <div className="h-80">
                    <DropZone fileInputRef={modalFileInput} />
                  </div>
                  <div className="flex flex-col justify-end items-center">
                    <div className="my-2 w-2/5">
                      <Button
                        className="btn-primary"
                        onClick={() => uploadFile()}
                      >
                        Subir
                      </Button>
                    </div>
                  </div>
                </div>
              </Modal>
            )}
          </>
        );
      })}
    </div>
  );
}
