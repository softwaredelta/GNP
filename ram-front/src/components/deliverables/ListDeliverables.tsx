// (c) Delta Software 2023, rights reserved.
import { useEffect, useRef, useState } from "react";
import useAxios from "../../hooks/useAxios";
import useModal from "../../hooks/useModal";
import { IUserDelivery } from "../../types";
import { Button } from "../button";
import DropZone from "../generics/DropZone";
import Modal from "../generics/Modal";
import DeliveryCard from "../generics/cards/DeliveryCard";

interface Props {
  deliverables: IUserDelivery[];
}

export default function ListDeliverables({ deliverables }: Props) {
  const [id, setId] = useState<string>("");

  const { isOpen, toggleModal } = useModal();
  const modalFileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleModalOpen = (deliveryCardID: string): void => {
    setId(deliveryCardID);
    toggleModal();
  };

  const { response, loading, error, callback } = useAxios({
    url: `user-delivery/upload/${id}`,
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  useEffect(() => {
    if (response) {
      console.log("Se subió el archivo");
      console.log(response);
    }
  }, [response]);

  const uploadFile = (): void => {
    console.log("El archivo que se sube es", file);
    if (file) {
      const formData: FormData = new FormData();
      formData.append("file", file);
      try {
        callback?.(formData);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("No se seleccionó ningún archivo");
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
                    <DropZone fileInputRef={modalFileInput} setFile={setFile} />
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
