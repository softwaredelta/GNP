// (c) Delta Software 2023, rights reserved.

import useSearch from "../../hooks/useSearch";
import { IProspects } from "../../types";
import RowProspect from "../prospects/RowProspect";

export interface IListProspectsProps {
  prospects: IProspects[];
}

export default function ListProspects({
  prospects,
}: IListProspectsProps): JSX.Element {
  const { handleSearch, data } = useSearch({ info: prospects, key: "name" });

  if (prospects.length === 0) return <h1>No hay prospectos</h1>;

  return (
    <div>
      <div className="mx-auto mt-5 grid w-10/12 grid-cols-1">
        <label htmlFor="search">
          <input
            id="search"
            type="text"
            onChange={handleSearch}
            className="mb-6 h-8 w-1/4 rounded-lg border-2 border-gnp-gray-ligth pl-3 text-base shadow-lg"
            placeholder="Busqueda por prospectos..."
          />
        </label>
      </div>
      {data.nodes.map((prospect) => {
        return (
          <RowProspect
            key={prospect.id}
            id={prospect.id}
            name={prospect.name}
            firstSurname={prospect.firstSurname}
            secondSurname={prospect.secondSurname}
            prospectStatus={prospect.prospectStatus}
          />
        );
      })}
    </div>
  );
}
