// (c) Delta Software 2023, rights reserved.

import { useState, ChangeEvent, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moneyGrowth from "../../assets/imgs/moneyGrowth.png";
import { TbSend } from "react-icons/tb";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";
import  { CreateNewSale, SaleData } from "../../lib/api/api-sale";
export interface IListAssuranceTypesProps {
  assuranceTypes: {
    id: string;
    name: string;
    description: string;
  }[];
}

const CardNewSale = ({ assuranceTypes }: IListAssuranceTypesProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [policyNum, setPolicyNum] = useState("");
  const [amount, setAmount] = useState("");
  const [client, setClient] = useState("");
  const [assuranceType, setAssuranceType] = useState(assuranceTypes[0].id);
  const [periodicity, setPeriodicity] = useState("")

  const handleAssuranceTypeChange = (event: any) => {
    setAssuranceType(event.target.value);
    //console.log(assuranceType);
  };

  const handlePeriodicityTypeChange = (event: any) => {
    setPeriodicity(event.target.value);
    //console.log(assuranceType);
  };

  const saleData: SaleData = {
    policyNumber: policyNum,
    sellDate: selectedDate,
    assuranceType: {
      id: assuranceType,
    },
    amountInCents: amount,
    clientName: client,
    periodicity: periodicity,
  };
  const { response, error, callback } = CreateNewSale({ saleData })

  // const { response, error, callback } = useAxios<{
  //   data: {
  //     group: {
  //       id: string;
  //       name: string;
  //     };
  //   };
  // }>({
  //   url: "sales/create",
  //   method: "POST",
  //   body: {
  //     policyNumber: policyNum,
  //     sellDate: selectedDate,
  //     assuranceType: {
  //       id: assuranceType,
  //     },
  //     amountInCents: amount,
  //     clientName: client,
  //     periodicity: periodicity,
  //   }
  // });

  const handleInputCharacterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const regex = /^[a-z A-Z ñ]*$/; // expresión regular que solo permite letras, números, guiones bajos y espacios
    if (regex.test(inputValue)) {
      setClient(inputValue);
    }
  };

  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "Success!",
        text: "La venta se ha registrado correctamente.",
        icon: "success",
      });
    } else if (error) {
      Swal.fire({
        title: "Error!",
        text: "Ocurrió un error al registrar la venta.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [response, error]);


  return (
    <div className="grid grid-cols-4 bg-gradient-to-t from-gnp-cream to-gnp-white rounded-lg m-4">
      <img
        src={moneyGrowth}
        alt="Imagen"
        className="rounded-l-lg object-cover hidden md:block md:h-full"
      />
      <div className="col-span-4 w-full md:w-full md:col-span-3 rounded-l-lg grid grid-cols">
        <div className="col bg-orange-500 flex justify-center p-4 items-center rounded-t-lg md:rounded-tr-lg">
          <h1 className="text-3xl my-2 font-bold text-white">Agregar venta</h1>
        </div>
        <div className="col grid grid-cols-4 gap-4">
          <div className="md:col-span-2 col-span-4 px-8 pt-8">
            <label className="block text-gray-700 ml-3 text-lg font-bold mb-1">
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
              minLength = {9} maxLength={9}
              required
            />
            <label className="block text-gray-700 ml-3 text-lg font-bold mb-1">
              Monto
            </label>
            <input
              className="input-primary w-full"
              type="text"
              placeholder="Ingrese el monto de la venta"
              value={amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAmount(e.target.value)
              }
              minLength={2} maxLength={7}
              required
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
              onChange={handleInputCharacterChange}
              required
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
              required
            />
            <label className="block text-gray-700 ml-3 text-lg font-bold mb-1">
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
            <label className="block text-gray-700 ml-3 text-lg font-bold mb-1">
              Periodicidad
            </label>
            <select className="input-primary w-full"
            value = {periodicity}
            onChange={handlePeriodicityTypeChange}>
              <option> semestral </option>
              <option> mensual </option>
              <option> anual </option>
            </select>
            <FileUpload onFileUpload={handleFileUpload} />
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
