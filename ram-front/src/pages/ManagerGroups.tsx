// (c) Delta Software 2023, rights reserved.

import { useRecoilValue } from "recoil";
import ModalGroupForm from "../components/forms/ModalGroupForm";
import { ManagerListGroups } from "../components/groups/ManagerListGroups";
import Wrapper from "../containers/Wrapper";
import useModal from "../hooks/useModal";
import { allCourses$ } from "../lib/api/api-courses";

// Manager view that list all groups
export default function ManagerCourses() {
  const groups = useRecoilValue(allCourses$);

  const { isOpen: isOpenGroupForm, toggleModal: toggleModalGroupForm } =
    useModal();

  return (
    <div>
      <Wrapper>
        <div>
          <div className="flex w-full justify-end px-20 pt-10">
            <div className="w-1/12 overflow-hidden rounded-3xl font-bold">
              <button
                onClick={toggleModalGroupForm}
                className="btn-primary"
                data-testid="button-modal"
              >
                Agregar
              </button>
              <ModalGroupForm
                isOpenModal={isOpenGroupForm}
                closeModal={toggleModalGroupForm}
                handlePost={(image, name) => {
                  alert(`Nombre: ${name} Imagen: ${image}`);
                }}
                title="Agregar Grupo"
                initialValues=""
              />
            </div>
          </div>
          <div className="grid place-items-center md:grid-cols-4">
            <ManagerListGroups groups={groups}></ManagerListGroups>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
