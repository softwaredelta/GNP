// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=2144727033
// * M1_S04
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1943755342
// * M1_S08
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=819425274
// * M1_S09

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ModalGroupForm from "../components/forms/ModalGroupForm";
import { ManagerListGroups } from "../components/groups/ManagerListGroups";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import useModal from "../hooks/useModal";
import { IGroup } from "../types";

// Manager view that list all groups
export default function ManagerCourses() {
  const { response: groups, callback: updateGroups } = useAxios<IGroup[]>({
    url: `groups/all`,
    method: "GET",
  });

  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  const navigate = useNavigate();

  const { isOpen: isOpenGroupForm, toggleModal: toggleModalGroupForm } =
    useModal();

  const { response, loading, error, callback } = useAxios<IGroup>({
    url: "groups/create",
    method: "POST",
  });

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "¡Error!",
        text: "No se pudo registrar el grupo",
        icon: "error",
      });
    }

    if (response) {
      Swal.fire({
        title: "¡Éxito!",
        text: "Grupo agregado exitosamente",
        icon: "success",
        timer: 5000,
      }).then(() => {
        updateGroups();
        navigate(`/group/edit/${response.id}`);
      });
    }
  }, [
    error,
    response,
    shouldUpdate,
    toggleModalGroupForm,
    updateGroups,
    navigate,
  ]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Wrapper>
        <div>
          <div className="flex w-full justify-end px-20 pt-10">
            <div className="w-1/12 overflow-hidden rounded-3xl font-bold">
              <button onClick={toggleModalGroupForm} className="btn-primary">
                Agregar
              </button>
              <ModalGroupForm
                isOpenModal={isOpenGroupForm}
                closeModal={toggleModalGroupForm}
                handlePost={(image, name) => {
                  if (!name) {
                    Swal.fire({
                      title: "¡Error!",
                      text: "Ingrese nombre del grupo en el campo",
                      icon: "error",
                    });
                    return;
                  }
                  if (!image) {
                    Swal.fire({
                      title: "¡Éxito!",
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
                    setShouldUpdate(true);
                  }
                }}
                isEditModal={false}
              />
            </div>
          </div>
          <div className="grid place-items-center md:grid-cols-4">
            {groups && (
              <ManagerListGroups groups={groups} onUpdated={updateGroups} />
            )}
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
