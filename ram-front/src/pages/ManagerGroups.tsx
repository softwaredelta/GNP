// (c) Delta Software 2023, rights reserved.

import Wrapper from "../containers/Wrapper";
import { useRecoilValue } from "recoil";
import { allCourses$ } from "../lib/api/api-courses";
import { ManagerListGroups } from "../components/groups/ManagerListGroups";
import useModal from "../hooks/useModal";
import ModalGroupForm from "../components/forms/ModalGroupForm";

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
              <button onClick={toggleModalGroupForm} className="btn-primary">
                Agregar
              </button>
              <ModalGroupForm
                isOpenModal={isOpenGroupForm}
                closeModal={toggleModalGroupForm}
                handlePost={(image, name) => {
                  alert(`Nombre: ${name} Imagen: ${image}`);
                }}
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
