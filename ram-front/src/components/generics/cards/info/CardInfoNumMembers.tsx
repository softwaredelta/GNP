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
}: ICardInfoNumMembersProps): JSX.Element {
  return (
    <div className=" grid h-full w-full grid-cols-1 grid-rows-2">
      <div className="grid grid-cols-3 place-items-center">
        <div className="col-span-2">
          <h1 className="text-semibold font-bold ">{nameGroup}</h1>
        </div>
        <div
          className="top-0 my-auto grid basis-4/12 grid-cols-2 justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="cursor-pointer transition-all ease-in-out hover:scale-125"
            onClick={() => alert("Redireccionando a editar curso ...")}
          >
            <FiEdit
              color="gray"
              size={20}
              className="hover:stroke-gnp-blue-900"
            />
          </button>
          <button
            className="cursor-pointer transition-all ease-in-out hover:scale-125"
            onClick={() => alert("Redireccionando a eliminar curso ...")}
          >
            <FiTrash2 color="gray" size={20} className="hover:stroke-red-900" />
          </button>
        </div>
      </div>
      <div className="mx-auto flex w-11/12 items-center justify-end">
        <div className="pr-2">
          <BsFillPeopleFill color="gray" />
        </div>
        {number} Miembros
      </div>
    </div>
  );
}
