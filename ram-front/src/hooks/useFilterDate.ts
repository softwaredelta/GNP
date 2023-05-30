// (c) Delta Software 2023, rights reserved.
import { useEffect, useState } from "react";

export interface IUseFilterDateReturn<T> {
  data: T[];
  dateInit: Date | null;
  dateEnd: Date | null;
  setDateInit: (date: Date | null) => void;
  setDateEnd: (date: Date | null) => void;
  updateInfo: (data: T[]) => void;
}

export interface IUseFilterDateProps<T> {
  info: Array<T>;
  key: string;
  initialDate?: string;
  endDate?: string;
}

export default function useFilterDate<T>({
  info,
  key,
  initialDate,
  endDate,
}: IUseFilterDateProps<T>): IUseFilterDateReturn<T> {
  const [data, setData] = useState<T[]>(info);
  const prevMonthDate: Date = initialDate ? new Date(initialDate) : new Date();
  const currentDate: Date = endDate ? new Date(endDate) : new Date();
  const [dateEnd, setDateEnd] = useState<Date | null>(currentDate);
  const [dateInit, setDateInit] = useState<Date | null>(prevMonthDate);

  const updateInfo = (newInfo: T[]) => {
    setData(newInfo);
  };

  useEffect(() => {
    if (dateInit && dateEnd) {
      const filteredData = info.filter(
        (item: any) =>
          new Date(item[key]) >= dateInit && new Date(item[key]) <= dateEnd,
      );
      setData(filteredData);
    }
  }, [dateInit, dateEnd]);

  return { data, dateEnd, dateInit, setDateEnd, setDateInit, updateInfo };
}
