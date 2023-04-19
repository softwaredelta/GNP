// (c) Delta Software 2023, rights reserved.

import React, { useState } from "react";
import { Label, TextInput } from "flowbite-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const SalesFilters = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div data-testid="Filters" className="flex">
      <div className="w-1/5 mr-4">
        <div className="mb-2 block ">
          <Label htmlFor="clientName" value="Nombre del cliente" />
        </div>
        <TextInput
          id="clientName"
          data-testid="ClientInput"
          type="text"
          placeholder="Kenny Vercamer"
        />
      </div>
      <div className="w-1/5 mr-4">
        <div className="mb-2 block">
          <Label htmlFor="policyNum" value="Póliza" />
        </div>
        <TextInput
          id="policyNum"
          data-testid="PolicyNumInput"
          type="number"
          placeholder="123455"
        />
      </div>
      <div className="w-1/5 mr-4">
        <div className="mb-2 block">
          <Label htmlFor="insuranceType" value="Tipo de Seguro" />
        </div>
        <TextInput id="insuranceType" type="text" placeholder="Vida" />
      </div>
      <div className="w-1/5 mr-8">
        <label
          htmlFor="datePicker"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Fecha
        </label>
        <DatePicker
          selected={selectedDate}
          name="datePicker"
          id="datePicker"
          onChange={(date: Date | null) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="w-1/5 block my-auto">
        <button className="btn-primary">Filtrar</button>
      </div>
    </div>
  );
};
