// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=832442920
// * M2_S02
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1535256513
// * M2_S07
import { useEffect } from "react";
import useSearch from "../../hooks/useSearch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ISell } from "../../types";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import useFilterDate from "../../hooks/useFilterDate";

export interface IListAssuranceTypesProps {
  sales: ISell[];
  setSales: (sales: ISell[]) => void;
}

export default function SalesFilters({
  sales,
  setSales,
}: IListAssuranceTypesProps) {
  const { data: dataName, handleSearch } = useSearch<ISell>({
    info: sales,
    key: "contractingClient",
  });
  const {
    data: dataPolicy,
    handleSearch: handleSearchPolicy,
    updateInfo: updateInfoPolicy,
  } = useSearch<ISell>({
    info: dataName,
    key: "policyNumber",
  });

  const { data, dateEnd, dateInit, setDateEnd, setDateInit, updateInfo } =
    useFilterDate<ISell>({
      info: dataPolicy,
      key: "paidDate",
      initialDate: dataPolicy.map((item) => item.paidDate).sort()[0] as string,
      endDate: dataPolicy
        .map((item) => item.paidDate)
        .sort()
        .reverse()[0] as string,
    });

  useEffect(() => {
    setSales(data);
  }, [data]);
  useEffect(() => {
    updateInfoPolicy(dataName);
  }, [dataName]);
  useEffect(() => {
    updateInfo(dataPolicy);
  }, [dataPolicy]);

  return (
    <div className="grid w-full grid-cols-4 gap-5  py-5">
      <div className="">
        <label className="label-primary">Nombre del cliente</label>
        <input type="text" onChange={handleSearch} className="input-primary" />
      </div>
      <div className="">
        <label className="label-primary">Poliza</label>
        <input
          type="text"
          onChange={handleSearchPolicy}
          className="input-primary"
        />
      </div>
      <div>
        <label className="label-primary">Fecha de Pago Inicio</label>
        <DatePicker
          selected={dateInit}
          name="datePicker"
          id="datePicker"
          onChange={(date: Date | null) => setDateInit(date)}
          dateFormat="dd/MM/yyyy"
          className="input-primary"
          placeholderText="dd/mm/aaaa"
          required
        />
      </div>
      <div>
        <label className="label-primary">Fecha de Pago Fin</label>
        <DatePicker
          selected={dateEnd}
          name="datePicker"
          id="datePicker"
          onChange={(date: Date | null) => setDateEnd(date)}
          dateFormat="dd/MM/yyyy"
          className="input-primary"
          placeholderText="dd/mm/aaaa"
          required
        />
      </div>
      <div className="col-span-2 col-start-2 mx-auto w-1/2 place-self-center pb-5">
        <Link to="/new-sale">
          <button className="btn-primary flex h-full items-center justify-center">
            <span className="font-semibold"> Agregar </span>
            <FiPlus size={20} className="ml-2" />
          </button>
        </Link>
      </div>
    </div>
  );
}
