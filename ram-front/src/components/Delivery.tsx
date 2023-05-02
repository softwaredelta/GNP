// (c) Delta Software 2023, rights reserved.

import axios from "axios";
import { useEffect, useRef, useState } from "react";
// import { AiOutlineFileProtect } from "react-icons/ai";
import { useRecoilValue } from "recoil";
import Wrapper from "../containers/Wrapper";
import useModal from "../hooks/useModal";
import { useAuthentication } from "../lib/api/api-auth";
import { apiBase$ } from "../lib/api/api-base";
import { Button } from "./button";
import DropZone from "./generics/DropZone";
import Modal from "./generics/Modal";
import DeliveryCard from "./generics/cards/DeliveryCard";

// import useAxios from "../hooks/useAxios";

function Delivery() {
  // Get data using axios from http://localhost:8080/user-delivery
  const [deliveries, setDeliveries] = useState<any>([]);
  const API_URL = useRecoilValue(apiBase$);
  const { auth } = useAuthentication();

  // FIX THIS: SHOULD USE RECOILD OR AXIOS HOOKS, STOP USING HARDCODED URLS
  useEffect(() => {
    axios.get("http://localhost:8080/user-delivery").then((response) => {
      setDeliveries(response.data);
    });
  }, []);

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

  const openFileInNewTab = (): void => {
    if (uploadFileURL) {
      window.open(uploadFileURL);
    }
  };

  return (
    <Wrapper>
      <>
        <div className="w-full min-h-[50vh] grid md:grid-cols-3 place-items-center gap-10 py-20">
          <div className="md:col-span-3 space-y-10 ">
            <DeliveryCard
              key="98759284375908"
              deliveryId="98759284375908"
              color="blue"
              nameDelivery="Nombre "
              onFileSubmit={() => handleModalOpen("test-delivery")}
              image="https://i.pinimg.com/474x/e2/e8/9e/e2e89eb6dd581f7f0a8a05a13675f4d4.jpg"
              status={deliveries}
            />
            {/*{deliveries.map((delivery: IDelivery) => (*/}
            {/*  <DeliveryCard*/}
            {/*    key={delivery.id}*/}
            {/*    deliveryID={delivery.id}*/}
            {/*    color="blue"*/}
            {/*    nameDelivery="Nombre de la entrega"*/}
            {/*    onFileSubmit={handleModalOpen}*/}
            {/*    image={delivery.imageUrl}*/}
            {/*  />*/}
            {/*))}*/}
          </div>
        </div>
        {isOpen && (
          <Modal closeModal={toggleModal}>
            <div className="flex flex-col space-y-5">
              <h3 className="text-4xl text-gnp-blue-600 font-bold my-4">
                Sube tu evidencia
              </h3>
              <div className="h-80">
                <DropZone file={null} setFile={() => {}} />
              </div>
              <div className="flex flex-col justify-end items-center">
                <div className="my-2 w-2/5">
                  <Button className="btn-primary" onClick={() => uploadFile()}>
                    Subir
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </>
    </Wrapper>
  );
}

export default Delivery;
