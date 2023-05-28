// (c) Delta Software 2023, rights reserved.

import { useEffect, useState } from "react";

export interface IDropdownFilterProps<T> {
  options: {
    value: string;
    label: string;
  }[];
  info: T[];
  property: string;
  setInfo: (data: T[]) => void;
}

export default function DropdownFilter<T>({
  options,
  property,
  info,
  setInfo,
}: IDropdownFilterProps<T>) {
  const [data, setData] = useState<Array<T>>(info);
  const [search, setSearch] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    const filteredData = info.filter((item: any) => {
      if (typeof item[property] === "string")
        if (search === "") return true;
        else
          return (item[property] as string)
            .toLowerCase()
            .includes(search.toLowerCase());
      else return false;
    });
    setData(filteredData);
  }, [search]);

  useEffect(() => {
    setInfo(data);
  }, [data]);
  return (
    <select
      className="input-primary "
      defaultValue={""}
      onChange={handleSearch}
    >
      <option value={""}> Todas </option>

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {" "}
          {option.label}{" "}
        </option>
      ))}
    </select>
  );
}
