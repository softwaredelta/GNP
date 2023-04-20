// (c) Delta Software 2023, rights reserved.
import { BsFillPeopleFill } from "react-icons/bs";
import { FiTrash2, FiEdit } from "react-icons/fi";

export interface ICardInfoNumMembersProps {
  nameGroup: string;
  number: number;
  color: "blue" | "orange";
}

export default function CardInfoNumMembers({
  nameGroup,
  number,
  color,
}: ICardInfoNumMembersProps): JSX.Element {
  return (
    <div className=" grid grid-cols-1 grid-rows-2 h-full w-full">
      <div className="grid grid-cols-3 place-items-center">
        <div className="col-span-2">
          <h1 className="font-bold text-semibold ">{nameGroup}</h1>
        </div>
        <div
          className="grid grid-cols-2 gap-2 top-0 basis-4/12 my-auto justify-end"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="hover:scale-125 transition-all ease-in-out cursor-pointer"
            onClick={() => alert("Redireccionando a editar curso ...")}
          >
            <FiEdit
              color="gray"
              size={20}
              className="hover:stroke-gnp-blue-900"
            />
          </button>
          <button
            className="hover:scale-125 transition-all ease-in-out cursor-pointer"
            onClick={() => alert("Redireccionando a eliminar curso ...")}
          >
            <FiTrash2 color="gray" size={20} className="hover:stroke-red-900" />
          </button>
        </div>
      </div>
      <div className="w-11/12 flex items-center justify-end mx-auto">
        <div className="pr-2">
          <BsFillPeopleFill color="gray" />
        </div>
        {number} Miembros
      </div>
    </div>
  );
}
