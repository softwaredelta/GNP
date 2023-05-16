// (c) Delta Software 2023, rights reserved.

import Wrapper from "../containers/Wrapper";
import { useRecoilValue } from "recoil";
import { allCourses$, useUpdateGroups } from "../lib/api/api-courses";
import { ManagerListGroups } from "../components/groups/ManagerListGroups";
import useModal from "../hooks/useModal";
import ModalGroupForm from "../components/forms/ModalGroupForm";
import { IGroup } from "../types";
import useAxios from "../hooks/useAxios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// Manager view that list all groups
export default function ManagerCourses() {
  const groups = useRecoilValue(allCourses$);
  const updateGroups = useUpdateGroups();
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);

  const { isOpen: isOpenGroupForm, toggleModal: toggleModalGroupForm } =
    useModal();

  const { response, loading, error, callback } = useAxios<IGroup[]>({
    url: "groups/create",
    method: "POST",
  });

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo registrar el grupo",
        icon: "error",
      });
    }

    if (response) {
      Swal.fire({
        title: "Grupo agregado",
        text: "Grupo agregado exitosamente",
        icon: "success",
      });

      if (shouldUpdate) {
        setShouldUpdate(false);
        updateGroups();
      }
    }
  }, [error, groups, response]);

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
                    setShouldUpdate(true);
                  }
                }}
              />
            </div>
          </div>
          <div className="grid place-items-center md:grid-cols-4">
            <ManagerListGroups groups={groups} />
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
