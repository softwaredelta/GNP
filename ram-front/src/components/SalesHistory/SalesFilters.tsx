// (c) Delta Software 2023, rights reserved.

import React, { useState, ChangeEvent } from "react";
import { Label, TextInput } from "flowbite-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaFilter } from "react-icons/fa";

export const SalesFilters = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [policyNum, setPolicyNum] = useState<string>("");

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
      <div className="col-span-1 flex justify-center items-center">
        <div className="w-40">
          <button className="btn-primary flex justify-center items-center">
            <span className="font-semibold"> Filtrar </span>
            <FaFilter size={15} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};
