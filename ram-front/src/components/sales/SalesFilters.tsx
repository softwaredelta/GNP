// (c) Delta Software 2023, rights reserved.

import { useState, ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaFilter } from "react-icons/fa";
import { IAssuranceType } from "../../types";

export interface IListAssuranceTypesProps {
  assuranceTypes: IAssuranceType[];
}

export const SalesFilters = ({ assuranceTypes }: IListAssuranceTypesProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [policyNum, setPolicyNum] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [assuranceType, setAssuranceType] = useState(assuranceTypes[0].id);

  const handleAssuranceTypeChange = (event: any) => {
    setAssuranceType(event.target.value);
  };

  return (
    <div data-testid="Filters" className="grid grid-cols-5 gap-8">
      <div className="col-span-1">
        <label className="block text-gray-700 ml-3 font-semibold mb-1">
          Póliza
        </label>
        <input
          className="input-primary w-full"
          type="text"
          placeholder="Ingrese el número de póliza"
          value={policyNum}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPolicyNum(e.target.value)
          }
        />
      </div>
      <div className="col-span-1">
        <label className="block text-gray-700 ml-3 font-semibold mb-1">
          Nombre de cliente
        </label>
        <input
          className="input-primary w-full"
          type="text"
          placeholder="Ingrese el número de póliza"
          value={client}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setClient(e.target.value)
          }
        />
      </div>
      <div className="col-span-1">
        <label className="block text-gray-700 ml-3 font-semibold mb-1">
          Tipo de seguro
        </label>
        <select
          className="input-primary w-full"
          value={assuranceType}
          onChange={handleAssuranceTypeChange}
        >
          {assuranceTypes.map((at, index) => (
            <option key={index} value={at.id}>
              {at.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-1">
        <label
          htmlFor="datePicker"
          className="block text-gray-700 ml-3 font-semibold mb-1"
        >
          Fecha
        </label>
        <DatePicker
          selected={selectedDate}
          name="datePicker"
          id="datePicker"
          onChange={(date: Date | null) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          className="input-primary w-full"
          placeholderText="dd/mm/aaaa"
          required
        />
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <div className="w-40 pb-2">
          <button className="btn-primary flex justify-center items-center">
            <span className="font-semibold"> Filtrar </span>
            <FaFilter size={15} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};
