// (c) Delta Software 2023, rights reserved.

import React, { useState, ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moneyGrowth from "../../assets/imgs/moneyGrowth.png";
import { TbSend } from "react-icons/tb";
import useAxios from "../../hooks/useAxios";
export interface IListAssuranceTypesProps {
  assuranceTypes: {
    id: string;
    name: string;
    description: string;
  }[];
}

const CardNewSale = ({ assuranceTypes }: IListAssuranceTypesProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [poliza, setPoliza] = useState("");
  const [monto, setMonto] = useState("");
  const [client, setClient] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const { response, error, loading, callback } = useAxios<{
    data: {
      group: {
        id: string;
        name: string;
      };
    };
  }>({
    url: "sales/create",
    method: "POST",
    body: {
      policyNumber: "56",
      sellDate: "12/03/2022",
      assuranceType: {
        name: "test-assurance-type-1",
        description: "test-assurance-type-1-description",
        id: "test-at-1",
      },
      amountInCents: "123456",
      clientName: "Renato FUNCIONA",
    },
  });

  return (
    <div className="grid grid-cols-4 bg-gradient-to-t from-gnp-cream to-gnp-white rounded-lg m-4">
      <img
        src={moneyGrowth}
        alt="Imagen"
        className="rounded-l-lg object-cover hidden md:block md:h-full"
      />
      <div className="col-span-4 w-96 md:w-full md:col-span-3 rounded-l-lg grid grid-cols">
        <div className="col bg-orange-500 flex justify-center p-4 items-center rounded-tr-lg">
          <h1 className="text-3xl my-2 font-bold text-white">Agregar venta</h1>
        </div>
        <div className="col grid grid-cols-4 gap-4">
          <div className="md:col-span-2 col-span-4 px-8 pt-8">
            <label className="block text-gray-700 ml-3 text-lg font-bold mb-1">
              Poliza
            </label>
            <input
              className="input-primary w-full"
              type="text"
              placeholder="Ingrese el número de poliza"
              value={poliza}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPoliza(e.target.value)
              }
            />
            <label className="block text-gray-700 ml-3 text-lg font-bold mb-1">
              Monto
            </label>
            <input
              className="input-primary w-full"
              type="number"
              placeholder="Ingrese el monto de la venta"
              value={monto}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMonto(e.target.value)
              }
            />
            <label className="block text-gray-700 ml-3 text-lg font-bold mb-1">
              Nombre del Cliente
            </label>
            <input
              className="input-primary w-full"
              type="text"
              data-testid="clientInput"
              placeholder="Ingrese el nombre del cliente"
              value={client}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setClient(e.target.value)
              }
            />
          </div>
          <div className="md:col-span-2 col-span-4 px-8 pt-8">
            <label
              htmlFor="datePicker"
              className="block text-gray-700 ml-3 text-lg font-bold mb-1"
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
            />
            <label className="block text-gray-700 ml-3 text-lg font-bold mb-1">
              Tipo de seguro
            </label>
            <select className="input-primary w-full">
              {assuranceTypes.map((at, index) => (
                <option key={index} value={at.name}>
                  {at.name}
                </option>
              ))}
            </select>
            <label className="block text-gray-700 ml-3 text-lg font-bold mb-1">
              Periodicidad
            </label>
            <select className="input-primary w-full">
              <option> semestral </option>
              <option> mensual </option>
              <option> anual </option>
            </select>
          </div>
          <div className="col-span-4 flex justify-center items-center pb-8">
            <div className="w-52">
              <button
                className="btn-primary flex justify-center items-center h-12"
                onClick={callback}
              >
                <span className="font-semibold text-lg"> Enviar </span>
                <TbSend size={20} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardNewSale;
