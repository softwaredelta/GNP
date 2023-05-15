// (c) Delta Software 2023, rights reserved.

import { useParams } from "react-router-dom";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { ManagerListGroupDeliveries } from "../components/deliverables/ListManagerDeliveries";
import { IGroup } from "../types";
import { RiAddBoxFill } from "react-icons/ri";
import ModalDeliveryForm from "../components/forms/ModalDeliveryForm";
import useModal from "../hooks/useModal";

export default function EditGroup() {
  const { id } = useParams();
  const { isOpen: isOpenDeliveryForm, toggleModal: toggleModalDeliveryForm } =
    useModal();

  const { response: group } = useAxios<IGroup>({
    url: `groups/${id}`,
    method: "GET",
  });

  return (
    <div>
      <Wrapper>
        <>
          <div className="flex w-full items-center justify-between py-8">
            <h1 className=" rounded-r-2xl bg-gnp-blue-500 py-3 px-20 text-xl font-bold text-white">
              {"Editando: " + group?.name}
            </h1>
            <div className="flex w-auto pr-8">
              <button
                onClick={toggleModalDeliveryForm}
                className="btn-primary flex-grid flex items-center"
              >
                {"Agregar entregable"}
                <RiAddBoxFill className="ml-2 inline-block" size={20} />
              </button>
            </div>
            <ModalDeliveryForm
              isOpenModal={isOpenDeliveryForm}
              closeModal={toggleModalDeliveryForm}
            />
          </div>
          <div className="flex min-h-[26%] w-full justify-center gap-10">
            <div className="w-3/5">
              {group && (
                <ManagerListGroupDeliveries
                  deliveries={group.deliveries ?? []}
                />
              )}
            </div>
          </div>
        </>
      </Wrapper>
    </div>
  );
}
