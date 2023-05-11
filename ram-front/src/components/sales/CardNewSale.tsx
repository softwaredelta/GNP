// (c) Delta Software 2023, rights reserved.

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moneyGrowth from "../../assets/imgs/moneyGrowth.png";
import { TbSend } from "react-icons/tb";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { IAssuranceType } from "../../types";
export interface IListAssuranceTypesProps {
  assuranceTypes: IAssuranceType[];
}


const CardNewSale = ({ assuranceTypes }: IListAssuranceTypesProps) => {
  const [paidDate, setPaidDate] = useState<Date | null>(null);

  type FormValues = {
    policyNumber: number;
    yearlyFee: number;
    contractingClient: string;
    assuranceTypeId: string;
    periodicity: string;
    paidDate: Date;
  };

  const { register, handleSubmit, reset } = useForm<FormValues>();

  const { response, error, callback } = useAxios({
    url: "sales/create",
    method: "POST",
    body: {},
  });

  const sendData = (data: FormValues) => {
    if (callback) {
      callback({
        ...data,
        paidDate: paidDate,
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
        yearlyFee: 0,
        contractingClient: "",
        assuranceTypeId: "1",
        periodicity: "Mensual",
      });
      setPaidDate(new Date());
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
    <div className="m-4 grid w-3/4 grid-cols-4 rounded-lg bg-gradient-to-t from-[#DBDFE6] to-[#FFEFDB] shadow-lg">
      <img
        src={moneyGrowth}
        alt="Imagen"
        className="hidden rounded-l-lg object-cover md:block md:h-full"
      />
      <div className="grid-cols col-span-4 grid w-full rounded-l-lg md:col-span-3 md:w-full">
        <div className="col flex items-center justify-center rounded-t-lg bg-orange-500 p-4 md:rounded-tr-lg">
          <h1 className="my-2 text-3xl font-bold text-white">Agregar venta</h1>
        </div>
        <div className="col grid grid-cols-4 gap-4">
          <div className="col-span-4 px-8 pt-8 md:col-span-2">
            <label className="ml-3 mb-1 block text-lg font-bold text-gray-700">
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
            <label className="ml-3 mb-1 block text-lg font-bold text-gray-700">
              Monto
            </label>
            <input
              className="input-primary w-full"
              type="number"
              placeholder="Ingrese el monto de la venta"
              {...register("yearlyFee", {
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
            <label className="ml-3 mb-1 block text-lg font-bold text-gray-700">
              Nombre del Cliente
            </label>
            <input
              className="input-primary w-full"
              placeholder="Ingrese el nombre del cliente"
              {...register("contractingClient", {
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
          <div className="col-span-4 px-8 pt-8 md:col-span-2">
            <label
              htmlFor="datePicker"
              className="ml-3 mb-1 block text-lg font-bold text-gray-700"
            >
              Fecha
            </label>
            <DatePicker
              selected={paidDate}
              name="datePicker"
              id="datePicker"
              onChange={(date: Date | null) => setPaidDate(date)}
              dateFormat="dd/MM/yyyy"
              className="input-primary w-full"
              placeholderText="dd/mm/aaaa"
              required
            />
            <label className="ml-3 mb-1 block text-lg font-bold text-gray-700">
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
            <label className="ml-3 mb-1 block text-lg font-bold text-gray-700">
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
          </div>

          <div className="col-span-4 flex items-center justify-center pb-8">
            <div className="w-52">
              <button
                className="btn-primary flex h-12 items-center justify-center"
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
                <span className="text-lg font-semibold"> Enviar </span>
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
