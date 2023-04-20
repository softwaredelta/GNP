// (c) Delta Software 2023, rights reserved.

import Wrapper from "../containers/Wrapper";
import DeliveryCard from "./generics/cards/DeliveryCard";
import useModal from "../hooks/useModal";
import { useRef, useState } from "react";
import Modal from "./generics/Modal";
import DropZone from "./generics/DropZone";
import axios from "axios";
import { Button } from "./button";

function Delivery() {
  const [id, setId] = useState<string>("");
  const { isOpen, toggleModal } = useModal(false);
  const modalFileInput = useRef<HTMLInputElement>(null);

  const handleModalOpen = (deliveryCardID: string): void => {
    setId(deliveryCardID);
    toggleModal();
  };

  // TODO: Pull authenticated user id using recoil.

  const uploadFile = (): void => {
    const file: File | undefined = modalFileInput.current?.files?.[0];
    if (file) {
      const formData: FormData = new FormData();
      formData.append("file", file);
      try {
        (async (): Promise<void> => {
          const response = await axios.post("", formData);
          console.debug(response);
        })();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <Wrapper>
        <>
          <div className="w-full min-h-[50vh] grid md:grid-cols-3 place-items-center gap-10 py-20">
            <div className="md:col-span-3 space-y-10 ">
              <DeliveryCard
                color="blue"
                nameDelivery="Nombre de la entrega"
                status="Sin enviar"
                onFileSubmit={handleModalOpen}
                image="https://i.blogs.es/799a0e/ydray-mew_27_articuno_45l_hyperx_environment_front/1366_2000.jpeg"
              />
              <DeliveryCard
                color="orange"
                nameDelivery="Nombre de la entrega segunda"
                status="Rechazado"
                onFileSubmit={handleModalOpen}
                image="https://i.blogs.es/799a0e/ydray-mew_27_articuno_45l_hyperx_environment_front/1366_2000.jpeg"
              />
            </div>
          </div>
          {isOpen && (
            <Modal closeModal={toggleModal}>
              <div className="flex flex-col space-y-5">
                <h3 className="text-4xl text-gnp-blue-600 font-bold my-4">
                  Sube tu evidencia
                </h3>
                <DropZone ref={modalFileInput} />
                <div className="mt-10 flex flex-row">
                  <Button onClick={() => uploadFile()}>Subir</Button>
                </div>
              </div>
            </Modal>
          )}
        </>
      </Wrapper>
    </>
  );
}

export default Delivery;
