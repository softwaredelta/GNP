// (c) Delta Software 2023, rights reserved.

import React, { useState, ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moneyGrowth from "../../assets/imgs/moneyGrowth.png";
import { TbSend } from "react-icons/tb";

export interface IListAssuranceTypesProps {
  assuranceTypes: {
    id: string;
    name: string;
    description: string;
  }[];
}

// const CardNewSale = (props: Props) => {
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const [poliza, setPoliza] = useState("");
//   const [monto, setMonto] = useState("");
//   const [client, setClient] = useState("");

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // Aquí se puede agregar la lógica para enviar los datos al servidor
//   };

//   return (
//     <div className="rounded-lg flex-wrap w-3/4 bg-gradient-to-t from-gnp-gray-ligth to-gnp-cream shadow-lg flex">
//       <img src={moneyGrowth} alt="Imagen" className="rounded-l-lg object-cover w-1/4 " />
//       <div className="w-3/4 h-full">
//         <div className="bg-orange-500 p-4 flex justify-center items-center rounded-l-lg">
//           <h1 className="text-3xl my-2 font-bold text-white">Agregar venta</h1>
//         </div>
//         <div className="p-4">
//           <form onSubmit={handleSubmit} className="flex flex-wrap">
//             <div className="w-1/2 p-2">
//               <label className="block text-gray-700 ml-3 text-lg font-bold mb-1">
//                 Poliza
//               </label>
//               <input
//                 className="input-primary w-full"
//                 type="text"
//                 placeholder="Ingrese el número de poliza"
//                 value={poliza}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   setPoliza(e.target.value)
//                 }
//               />
//             </div>
//             <div className="w-1/2 p-2">
//               <label
//                 htmlFor="datePicker"
//                 className="block text-gray-700 ml-3 text-lg font-bold mb-1"
//               >
//                 Fecha
//               </label>
//               <DatePicker
//                 selected={selectedDate}
//                 name="datePicker"
//                 id="datePicker"
//                 onChange={(date: Date | null) => setSelectedDate(date)}
//                 dateFormat="dd/MM/yyyy"
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               />
//             </div>
//             <div className="w-1/2 p-2">
//               <label className="block text-gray-700 ml-3 text-lg font-bold mb-1">
//                 Monto
//               </label>
//               <input
//                 className="input-primary w-full"
//                 type="number"
//                 placeholder="Ingrese el monto de la venta"
//                 value={monto}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   setMonto(e.target.value)
//                 }
//               />
//             </div>
//             <div className="w-1/2 p-2">
//               <label className="block text-gray-700 ml-3 text-lg font-bold mb-1">
//                 Nombre del Cliente
//               </label>
//               <input
//                 className="input-primary w-full"
//                 type="text"
//                 data-testid="clientInput"
//                 placeholder="Ingrese el nombre del cliente"
//                 value={client}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   setClient(e.target.value)
//                 }
//               />
//             </div>
//             <div className="w-1/2 p-2">
//               <label className="block text-gray-700 ml-3 text-lg font-bold mb-1">
//                 Adjuntar evidencia
//               </label>
//               <input
//                 className="input-primary w-full"
//                 type="text"
//                 placeholder="Ingrese el nombre del cliente"
//                 value={client}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   setClient(e.target.value)
//                 }
//               />
//             </div>
//             <div className="w-1/2 p-2">
//               <label className="block text-gray-700 ml-3 text-lg font-bold mb-1">
//                 Tipo de seguro
//               </label>
//               <input
//                 className="input-primary w-full"
//                 type="text"
//                 placeholder="Ingrese el nombre del cliente"
//                 value={client}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   setClient(e.target.value)
//                 }
//               />
//             </div>
//             <div className="w-full flex items-center justify-center">
//                 <div className="w-48">
//                     <button className="btn-primary flex justify-center items-center h-12" type="submit">
//                       <span className="font-semibold text-lg"> Enviar </span><TbSend size={20} className="ml-2" />
//                     </button>
//                 </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
//  };
const CardNewSale = ({ assuranceTypes }: IListAssuranceTypesProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [poliza, setPoliza] = useState("");
  const [monto, setMonto] = useState("");
  const [client, setClient] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí se puede agregar la lógica para enviar los datos al servidor
  };
  // function SelectAssusranceTypes({assurance_types}) {
  //   const opciones = assurance_types.map((name, index) => (
  //     <option key={index} value={name}>{name}</option>
  //   ));

  return (
    <div className="rounded-lg flex-col md:flex-row w-full md:w-3/4 bg-gradient-to-t from-gnp-gray-ligth to-gnp-cream shadow-lg flex">
      <img
        src={moneyGrowth}
        alt="Imagen"
        className="rounded-l-lg object-cover lg:h-full sm:h-full h-full md:h-full "
      />
      <div className="w-full md:w-3/4 h-full">
        <div className="bg-orange-500 p-4 flex justify-center items-center rounded-l-lg">
          <h1 className="text-3xl my-2 font-bold text-white">Agregar venta</h1>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit} className="flex flex-wrap">
            <div className="w-full md:w-1/2 md:p-2">
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
            </div>
            <div className="w-full md:w-1/2 md:p-2">
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="w-full md:w-1/2 md:p-2">
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
            </div>
            <div className="w-full md:w-1/2 md:p-2">
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
            <div className="w-full md:w-1/2 md:p-2">
              <label className="block text-gray-700 ml-3 text-lg font-bold mb-1">
                Adjuntar evidencia
              </label>
              <input
                className="input-primary w-full"
                type="text"
                placeholder="Ingrese el nombre del cliente"
                value={client}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setClient(e.target.value)
                }
              />
            </div>
            <div className="w-full md:w-1/2 md:p-2">
              <label className="block text-gray-700 ml-3 text-lg font-bold mb-1">
                Tipo de seguro
              </label>
              <select>
                {assurance_types.map((at, index) => (
                  <option key={index} value={at.name}>
                    {at.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full flex items-center justify-center">
              <div className="w-48">
                <button
                  className="btn-primary flex justify-center items-center h-12"
                  type="submit"
                >
                  <span className="font-semibold text-lg"> Enviar </span>
                  <TbSend size={20} className="ml-2" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CardNewSale;