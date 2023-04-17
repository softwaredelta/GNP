// (c) Delta Software 2023, rights reserved.

import React, { useState, ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moneyGrowth from "../assets/imgs/moneyGrowth.png";
import { TbSend } from "react-icons/tb";

export function NewSale() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [poliza, setPoliza] = useState("");
  const [monto, setMonto] = useState("");
  const [client, setClient] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí se puede agregar la lógica para enviar los datos al servidor
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <div className="w-3/4 h-3/5 bg-gradient-to-t from-gnp-gray-ligth to-gnp-cream rounded-lg shadow-lg flex">
        <div className="w-1/4 h-full bg-gray-800 items-center justify-center">
          <img
            src={moneyGrowth}
            alt="Imagen"
            className="object-cover h-full w-full"
          />
        </div>
        <div className="w-3/4 h-full">
          <div className="bg-orange-500 p-4 flex justify-center items-center">
            <h1 className="text-3xl my-2 font-bold text-white">
              Agregar venta
            </h1>
          </div>
          <div className="p-4">
            <form onSubmit={handleSubmit} className="flex flex-wrap">
              <div className="w-1/2 p-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Poliza
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Ingrese el número de poliza"
                  value={poliza}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPoliza(e.target.value)
                  }
                />
              </div>
              <div className="w-1/2 p-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Fecha
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="w-1/2 p-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Monto
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="number"
                  placeholder="Ingrese el monto de la venta"
                  value={monto}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setMonto(e.target.value)
                  }
                />
              </div>
              <div className="w-1/2 p-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre del Cliente
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Ingrese el nombre del cliente"
                  value={client}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setClient(e.target.value)
                  }
                />
              </div>
              <div className="w-1/2 p-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Adjuntar evidencia
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Ingrese el nombre del cliente"
                  value={client}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setClient(e.target.value)
                  }
                />
              </div>
              <div className="w-1/2 p-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tipo de seguro
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Ingrese el nombre del cliente"
                  value={client}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setClient(e.target.value)
                  }
                />
              </div>
              <div className="w-full p-2 flex justify-center items-center">
                <button
                  className="bg-gnp-primary-blue hover:bg-gnp-primary-blue text-white font-bold flex justify-center items-center py-2 mt-4 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Enviar <TbSend size={20} className="ml-2" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
