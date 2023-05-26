// (c) Delta Software 2023, rights reserved.

import { useState, useEffect } from "react";

export interface IUseSearchReturn<T> {
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  data: Array<T>;
}

export interface IUseSearchProps<T> {
  info: Array<T>;
  key: string;
}

export default function useSearch<T>({
  info,
  key,
}: IUseSearchProps<T>): IUseSearchReturn<T> {
  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState<Array<T>>(info);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    const filteredData = info.filter((item: any) =>
      item[key].toLowerCase().includes(search.toLowerCase()),
    );
    setData(filteredData);
  }, [search]);

  return { handleSearch, data };
}
