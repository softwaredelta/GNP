// (c) Delta Software 2023, rights reserved.

import { RiAddBoxFill } from "react-icons/ri";
import { useParams } from "react-router-dom";
import ModalDeliveryForm from "../components/forms/ModalDeliveryForm";
import SearchAgentTable from "../components/tables/SearchAgentTable";
import SearchDeliveryTable from "../components/tables/SearchDeliveryTable";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import useModal from "../hooks/useModal";
import { IGroup, IUser } from "../types";
import AgentFuzzyFinder from "../components/agent/AgentFuzzyFinder";

export default function EditGroup() {
  const { id } = useParams();
  const { isOpen: isOpenDeliveryForm, toggleModal: toggleModalDeliveryForm } =
    useModal();

  const { response: group } = useAxios<IGroup>({
    url: `groups/${id}`,
    method: "GET",
  });
  const { response: groupAgents } = useAxios<IUser[]>({
    url: `groups/users/${id}`,
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
            <div className="col-span-3">
              {groupAgents && <SearchAgentTable agents={groupAgents ?? []} />}
              <AgentFuzzyFinder />
            </div>
            <div className="col-span-3">
              {group && (
                <SearchDeliveryTable deliveries={group.deliveries ?? []} />
              )}
            </div>
          </div>
        </>
      </Wrapper>
    </div>
  );
}
