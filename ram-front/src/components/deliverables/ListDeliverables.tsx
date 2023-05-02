// (c) Delta Software 2023, rights reserved.
import { useEffect, useRef, useState } from "react";
import useAxios from "../../hooks/useAxios";
import useModal from "../../hooks/useModal";
import { IUserDelivery } from "../../types";
import { Button } from "../button";
import DropZone from "../generics/DropZone";
import Modal from "../generics/Modal";
import DeliveryCard from "../generics/cards/DeliveryCard";
import useAlert from "../../hooks/useAlert";

interface Props {
  deliverables: IUserDelivery[];
}

export default function ListDeliverables({ deliverables }: Props) {
  const [id, setId] = useState<string>("");
  const { showAlert } = useAlert();
  const { isOpen, toggleModal } = useModal();
  const modalFileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleModalOpen = (deliveryCardID: string): void => {
    setId(deliveryCardID);
    toggleModal();
  };

  const { response, loading, error, callback } = useAxios<{
    dateDelivery: string;
    deliveryId: string;
    fileUrl: string;
    status: string;
    userId: string;
  }>({
    url: `user-delivery/upload/${id}`,
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  useEffect(() => {
    if (response) {
      showAlert(
        {
          type: "success",
          message: "Archivo subido",
          description: "Se subió el archivo",
        },
        5,
      );

      deliverables = deliverables.map((elem) => {
        if (elem.deliveryId === response.deliveryId) {
          elem.status = "Enviado";
          elem.fileUrl = response.fileUrl;
        }
        return elem;
      });
    }
    if (error) {
      showAlert(
        {
          type: "error",
          message: "Archivo no subido",
          description: "No se subió el archivo",
        },
        5,
      );
    }
  }, [response]);

  const uploadFile = (): void => {
    if (file) {
      const formData: FormData = new FormData();
      formData.append("file", file);
      try {
        callback?.(formData);
      } catch (err) {
        console.error(err);
      }
      setTimeout(() => {
        toggleModal();
        setFile(null);
      }, 1200);
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
              key={index}
              deliveryId={elem.deliveryId}
              onFileSubmit={() => handleModalOpen(elem.deliveryId)}
              nameDelivery={elem.delivery.deliveryName}
              image={elem.delivery.imageURL}
              color={index % 2 ? "orange" : "blue"}
              status={elem.status}
              fileUrl={elem.fileUrl}
            />
            {isOpen && (
              <Modal closeModal={toggleModal}>
                <div className="flex flex-col space-y-5">
                  <h3 className="text-4xl text-gnp-blue-600 font-bold my-4">
                    Sube tu evidencia
                  </h3>
                  <div className="h-80">
                    <DropZone file={file} setFile={setFile} />
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
