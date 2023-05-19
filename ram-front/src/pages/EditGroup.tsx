// (c) Delta Software 2023, rights reserved.

import { useEffect, useState } from "react";
import { RiAddBoxFill } from "react-icons/ri";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import AgentFuzzyFinder from "../components/agent/AgentFuzzyFinder";
import ModalGroupForm from "../components/forms/ModalGroupForm";
import ModalDeliveryFormCreate from "../components/forms/ModalDeliveryFormCreate";
import SearchAgentTable from "../components/tables/SearchAgentTable";
import SearchDeliveryTable from "../components/tables/SearchDeliveryTable";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import useModal from "../hooks/useModal";
import { useUpdateGroups } from "../lib/api/api-courses";
import { IGroup, IUser } from "../types";

export default function EditGroup() {
  const id = useParams().id as string;
  const { isOpen: isOpenGroupForm, toggleModal: toggleModalGroupForm } =
    useModal();
  const { isOpen: isOpenDeliveryForm, toggleModal: toggleModalDeliveryForm } =
    useModal();
  const updateGroups = useUpdateGroups();
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);

  const { response: group, callback: updateGroupDeliveries } = useAxios<IGroup>(
    {
      url: `groups/${id}`,
      method: "GET",
    },
  );
  const { response: groupAgents, callback: updateGroupAgents } = useAxios<
    IUser[]
  >({
    url: `groups/users/${id}`,
    method: "GET",
  });

  const { response, error, loading, callback } = useAxios({
    url: `groups/update/${id}`,
    method: "PUT",
  });

  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "Grupo modificado",
        text: "El grupo se ha modificado correctamente",
        icon: "success",
      });
    }

    if (error) {
      Swal.fire({
        title: "Grupo no modificado",
        text: "El grupo no se ha modificado correctamente",
        icon: "error",
      });
    }
    if (shouldUpdate) {
      setShouldUpdate(false);
      toggleModalGroupForm();
      updateGroups();
    }
  }, [response, error]);

  if (loading) {
    return <p>Loading...</p>;
  }
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
                onClick={toggleModalGroupForm}
                className="btn-primary pr-7"
                data-testid="button-modal"
              >
                Editar Grupo
              </button>
              {group && (
                <ModalGroupForm
                  isOpenModal={isOpenGroupForm}
                  closeModal={toggleModalGroupForm}
                  handlePost={(image, name) => {
                    if (!image) {
                      Swal.fire({
                        title: "Imagen faltante",
                        text: "Inserte una imagen en el campo",
                        icon: "error",
                      });
                      return;
                    }
                    if (callback) {
                      const data: FormData = new FormData();
                      data.append("image", image);
                      data.append("name", name);
                      callback(data);
                    }
                  }}
                  isEditModal={true}
                  initialValues={{ name: group.name, imageURL: group.imageURL }}
                />
              )}
              <button
                onClick={toggleModalDeliveryForm}
                className="btn-primary flex-grid flex items-center"
              >
                {"Agregar entregable"}
                <RiAddBoxFill className="ml-2 inline-block" size={20} />
              </button>
            </div>
            <ModalDeliveryFormCreate
              isOpenModal={isOpenDeliveryForm}
              closeModal={() => {
                toggleModalDeliveryForm();
                updateGroupDeliveries();
              }}
            />
          </div>
          <div className="flex min-h-[26%] w-full justify-center gap-10">
            <div className="col-span-3">
              {groupAgents && (
                <SearchAgentTable
                  onReloadAgents={() => updateGroupAgents()}
                  groupId={id}
                  agents={groupAgents ?? []}
                />
              )}
              <div className="mt-4" />
              <AgentFuzzyFinder
                groupId={id}
                onReloadAgents={() => updateGroupAgents()}
                groupAgents={groupAgents ?? []}
              />
            </div>
            <div className="col-span-3">
              {group && (
                <SearchDeliveryTable
                  deliveries={group.deliveries ?? []}
                  onReloadDeliveries={() => updateGroupDeliveries()}
                />
              )}
            </div>
          </div>
        </>
      </Wrapper>
    </div>
  );
}
