// (c) Delta Software 2023, rights reserved.

import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import AgentFuzzyFinder from "../components/agent/AgentFuzzyFinder";
import ModalDeliveryFormCreate from "../components/forms/ModalDeliveryFormCreate";
import ModalGroupForm from "../components/forms/ModalGroupForm";
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
    method: "POST",
  });

  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "¡Éxito!",
        text: "El grupo se ha modificado correctamente",
        icon: "success",
      });
    }

    if (error) {
      Swal.fire({
        title: "¡Error!",
        text: "El grupo no se ha modificado correctamente",
        icon: "error",
      });
    }
    if (shouldUpdate) {
      setShouldUpdate(false);
      setTimeout(() => {
        toggleModalGroupForm();
      }, 1200);
      updateGroups();
    }
  }, [response, error]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <Wrapper title={"Editando: " + group?.name}>
        <>
          <div className="flex w-full items-end justify-end justify-items-end py-8 pl-4">
            <div>
              <button
                onClick={toggleModalGroupForm}
                className="btn-primary pr-4"
                data-testid="button-modal"
              >
                Editar Grupo
              </button>
            </div>
            {group && (
              <ModalGroupForm
                isOpenModal={isOpenGroupForm}
                closeModal={toggleModalGroupForm}
                handlePost={(image, name) => {
                  if (
                    callback &&
                    (image !== group.imageUrl || name !== group.name)
                  ) {
                    const data: FormData = new FormData();
                    if (image) {
                      data.append("image", image);
                    }
                    data.append("name", name);
                    callback(data);
                  }
                }}
                isEditModal={true}
                initialValues={{
                  name: group.name,
                  imageUrl: group.imageUrl,
                  deliveries: group.deliveries,
                }}
              />
            )}
            <div className="pr-20 pl-6">
              <button
                onClick={toggleModalDeliveryForm}
                className="btn-primary flex-grid flex items-end"
              >
                {"Agregar entregable"}
                <FiPlus className="ml-2 inline-block" size={22} />
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
                  initialValues={{ name: group.name, imageUrl: group.imageUrl }}
                />
              )}
              <div className="pl-4">
                <button
                  onClick={toggleModalDeliveryForm}
                  className="btn-primary flex-grid flex items-center"
                >
                  {"Agregar entregable"}
                  <RiAddBoxFill className="ml-2 inline-block" size={20} />
                </button>
              </div>
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
