// (c) Delta Software 2023, rights reserved.

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moneyGrowth from "../../assets/imgs/moneyGrowth.png";
import { TbSend } from "react-icons/tb";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { IAssuranceType } from "../../types";

export interface IListAssuranceTypesProps {
  assuranceTypes: IAssuranceType[];
}

const CardNewSale = ({ assuranceTypes }: IListAssuranceTypesProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [evidence, setEvidence] = useState<string>("");

  type FormValues = {
    policyNumber: number;
    amountInCents: number;
    clientName: string;
    assuranceTypeId: string;
    periodicity: string;
    selectedDate: Date;
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();


  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    setEvidence(fileUrl);
   
  };

  const { response, error, callback } = useAxios({
    url: "sales/create",
    method: "POST",
    body: {},
  });

  const sendData = (data: FormValues) => {
    if (callback) {
      callback({
        ...data,
        sellDate: selectedDate,
        evidenceUrl: evidence,
      });
    }
  };

  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "Success!",
        text: "La venta se ha registrado correctamente.",
        icon: "success",
      });
      reset({
        policyNumber: 0,
        amountInCents: 0,
        clientName: "",
        assuranceTypeId: "1",
        periodicity: "Mensual",
      });
      setSelectedDate(new Date());
    } else if (error) {
      Swal.fire({
        title: "Error!",
        text: `Ocurrió un error al registrar la venta.\n
        ${(error as any).response.data.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [response, error]);

  return (
    <div className="grid grid-cols-4 w-3/4 bg-gradient-to-t from-[#DBDFE6] to-[#FFEFDB] rounded-lg m-4 shadow-lg">
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
              placeholder="Ingrese el número de póliza"
              type="number"
              {...register("policyNumber", {
                required: "El campo poliza es requerido",
                minLength: {
                  value: 9,
                  message: "El número de póliza debe tener al menos 9 dígitos",
                },
                maxLength: {
                  value: 9,
                  message: "El número de póliza debe tener máximo 9 dígitos",
                },
              })}
            />
            <label className="block text-gray-700 ml-3 text-lg font-bold mb-1">
              Monto
            </label>
            <input
              className="input-primary w-full"
              type="number"
              placeholder="Ingrese el monto de la venta"
              {...register("amountInCents", {
                required: "El campo monto de venta es requerido",
                minLength: {
                  value: 2,
                  message: "El monto debe tener al menos 2 dígitos",
                },
                maxLength: {
                  value: 7,
                  message: "El monto debe tener máximo 7 dígitos",
                },
                min: {
                  value: 1,
                  message: "El monto debe ser mayor a 0",
                },
              })}
            />
            <label className="block text-gray-700 ml-3 text-lg font-bold mb-1">
              Nombre del Cliente
            </label>
            <input
              className="input-primary w-full"
              placeholder="Ingrese el nombre del cliente"
              {...register("clientName", {
                required: "El campo Nombre del cliente es requerido",
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "El nombre debe tener máximo 50 caracteres",
                },
              })}
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
              {...register("assuranceTypeId", {
                required: "El campo tipo de seguro es requerido",
              })}
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
            <select
              className="input-primary w-full"
              {...register("periodicity", {
                required: "El campo periodicidad es requerido",
              })}
            >
              <option value={"Semestral"}> Semestral </option>
              <option value={"Mensual"}> Mensual </option>
              <option value={"Anual"}> Anual </option>
            </select>

            <input type="file" onChange={handleFileUpload} />
          </div>

          <div className="col-span-4 flex justify-center items-center pb-8">
            <div className="w-52">
              <button
                className="btn-primary flex justify-center items-center h-12"
                onClick={handleSubmit(sendData, (errorsFields) => {
                  Swal.fire({
                    title: "Error!",
                    text: `Ocurrió un error al registrar la venta.\n
                    ${Object.values(errorsFields).map((e) => e.message + " ")}`,
                    icon: "error",
                    confirmButtonText: "OK",
                  });
                })}
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
