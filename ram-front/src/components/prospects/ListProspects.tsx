// (c) Delta Software 2023, rights reserved.

import { useNavigate } from "react-router-dom";
import useSearch from "../../hooks/useSearch";
import { IProspect, IStatus } from "../../types";
import RowProspect from "../prospects/RowProspect";

export interface IListProspectsProps {
  prospects: IProspect[];
  listStatus?: IStatus[];
  handleStatusEdit: (data: {
    prospectId: string;
    statusId: string;
    statusComment: string;
  }) => void;
}

export default function ListProspects({
  prospects,
  listStatus,
  handleStatusEdit,
}: IListProspectsProps): JSX.Element {
  const navigate = useNavigate();

  const { handleSearch, data } = useSearch({
    info: prospects.map((prospect) => ({
      ...prospect,
      fullName: `${prospect.name} ${prospect.firstSurname} ${prospect.secondSurname}`,
    })),
    key: "fullName",
  });

  if (prospects.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-700">
          No hay prospectos
        </h1>
        <p className="text-lg text-gray-500">
          Parece que no hay prospectos en este momento. Por favor, inténtelo de
          nuevo más tarde.
        </p>
      </div>
    );
  }
  return (
    <div>
      <div className="mx-auto mt-5 grid w-10/12 grid-cols-1">
        <label htmlFor="search">
          <input
            id="search"
            type="text"
            onChange={handleSearch}
            className="mb-10 h-8 w-1/4 rounded-lg border-2 border-gnp-gray-ligth pl-3 text-base shadow-lg"
            placeholder="Busqueda por prospectos..."
          />
        </label>

        <div className="grid grid-cols-8 gap-5">
          <div className="col-span-2 flex items-center justify-center">
            <div className="col-span-1 w-2/3 rounded-md bg-gnp-orange-500">
              <p className="px-2 py-2 text-center font-semibold text-white">
                Nombre del prospecto
              </p>
            </div>
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <div className="col-span-1 w-2/3 rounded-md bg-gnp-orange-500">
              <p className="px-2 py-2 text-center font-semibold text-white">
                Estado
              </p>
            </div>
          </div>
          <div className="col-span-3 flex items-center justify-center ">
            <div className="col-span-1 w-2/3 rounded-md bg-gnp-orange-500">
              <p className="px-1 py-2 text-center font-semibold text-white">
                Comentario
              </p>
            </div>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <div className="w-2/3 rounded-md bg-gnp-orange-500">
              <p className="px-2 py-2 text-center font-semibold text-white">
                Acciones
              </p>
            </div>
          </div>
        </div>
      </div>
      {data.map((prospect: IProspect) => {
        return (
          <div
            key={prospect.id}
            onClick={() => navigate(`/prospect-history/${prospect.id}`)}
          >
            <RowProspect
              id={prospect.id}
              name={prospect.name}
              firstSurname={prospect.firstSurname}
              secondSurname={prospect.secondSurname}
              prospectStatus={prospect.prospectStatus}
              listStatus={listStatus}
              handleEdit={(prospectId, statusId, statusComment) =>
                handleStatusEdit({ prospectId, statusId, statusComment })
              }
            />
          </div>
        );
      })}
    </div>
  );
}
