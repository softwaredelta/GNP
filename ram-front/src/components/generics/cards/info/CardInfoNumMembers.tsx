// (c) Delta Software 2023, rights reserved.
import { FiEdit, FiTrash2, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAxios from "../../../../hooks/useAxios";
import { useUpdateGroups } from "../../../../lib/api/api-courses";

export interface ICardInfoNumMembersProps {
  nameGroup: string;
  number: number;
  color: "blue" | "orange";
  groupId: string;
}

export default function CardInfoNumMembers({
  nameGroup,
  number,
  groupId,
}: ICardInfoNumMembersProps): JSX.Element {
  const { callback } = useAxios({
    url: `groups/${groupId}`,
    method: "DELETE",
    body: {},
  });

  const updateGroups = useUpdateGroups();

  function handleDelete() {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed && callback) {
        callback();
        Swal.fire("¡Éxito!", "El grupo ha sido eliminado", "success").then(
          () => {
            updateGroups();
          },
        );
      }
    });
  }
  return (
    <div className=" grid h-full w-full grid-cols-1 grid-rows-2">
      <div className="grid grid-cols-3 place-items-center">
        <div className="col-span-2">
          <h1 className="text-semibold font-bold ">{nameGroup}</h1>
        </div>
        <div
          className="top-0 my-auto grid grid-cols-2 justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Link to={`/group/edit/${groupId}`}>
            <button className="cursor-pointer pt-1 transition-all ease-in-out hover:scale-125">
              <FiEdit
                color="gray"
                size={20}
                className="hover:stroke-gnp-blue-900"
              />
            </button>
          </Link>
          <button className="cursor-pointer transition-all ease-in-out hover:scale-125">
            <FiTrash2
              color="gray"
              size={20}
              className="hover:stroke-red-900"
              onClick={() => handleDelete()}
            />
          </button>
        </div>
      </div>
      <div className="mx-auto flex w-11/12 items-center justify-end">
        <div className="pr-2">
          <FiUsers size={20} color="gray" />
        </div>
        {number} Miembros
      </div>
    </div>
  );
}
