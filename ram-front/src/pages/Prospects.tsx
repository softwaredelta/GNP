// (c) Delta Software 2023, rights reserved.

import wip_3 from "../assets/imgs/wip_3.svg";
import Wrapper from "../containers/Wrapper";
import { AiOutlinePlus } from "react-icons/ai";
import useModal from "../hooks/useModal";
import ModalProspectForm from "../components/forms/ModalProspectForm";

export default function Prospects() {
  const { isOpen, toggleModal } = useModal(true);

  return (
    <Wrapper>
      <>
        <ModalProspectForm
          isOpenModal={isOpen}
          closeModal={toggleModal}
          handlePost={(data) => {
            alert(JSON.stringify(data));
          }}
        />
        <div className="mt-8">
          <div className=" flex justify-end px-5">
            <div className="flex">
              <button className="btn-secondary" onClick={toggleModal}>
                Agregar prospecto{" "}
                <AiOutlinePlus className="ml-1 inline font-bold" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center p-4">
            <img
              src={wip_3}
              className="h-1/2 w-1/2 md:h-1/5 md:w-1/5"
              alt="Work in progress"
            />
          </div>
          <h1 className="flex justify-center text-3xl font-bold text-gnp-blue-900">
            Estamos trabajando en
          </h1>
          <h1 className="flex justify-center text-3xl font-bold text-orange-500">
            Prospectos
          </h1>
        </div>
      </>
    </Wrapper>
  );
}
