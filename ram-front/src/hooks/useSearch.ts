// (c) Delta Software 2023, rights reserved.

import { useState } from "react";
import { IDelivery, IProspects, IUser } from "../types";

export interface UseSearchReturn {
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  data: { nodes: IDelivery | IDelivery | IProspects };
}

export interface IUseSearchProps {
  info: IUser[] | IDelivery[] | IProspects[];
  key: string;
}

export default function useSearch({ info }: IUseSearchProps): UseSearchReturn {
  const [search, setSearch] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const data = {
    nodes: info.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    ),
  };

  return { handleSearch, data };
}
