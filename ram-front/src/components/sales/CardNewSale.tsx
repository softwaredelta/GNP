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
import { FileInput } from "flowbite-react";

export interface IListAssuranceTypesProps {
  assuranceTypes: IAssuranceType[];
}

const CardNewSale = ({ assuranceTypes }: IListAssuranceTypesProps) => {
  const [paidDate, setPaidDate] = useState<Date | null>(null);
  const [emissionDate, setEmissionDate] = useState<Date | null>(null);

  const [file, setFile] = useState<File | null>(null);

  type FormValues = {
    policyNumber: number;
    assuranceTypeId: string;
    userId: string;
    paidDate: Date;
    yearlyFee: number;
    contractingClient: string;
    periodicity: string;
    paidFee: number;
    insuredCostumer: string;
    emissionDate: Date;
  };

  const { register, handleSubmit, reset } = useForm<FormValues>();

  const { response, error, callback } = useAxios({
    url: "sales/create",
    method: "POST",
  });

  const sendData = (data: FormValues) => {
    if (file) {
      const formData: FormData = new FormData();
      formData.append("file", file);
      formData.append("policyNumber", data.policyNumber.toString());
      formData.append("assuranceTypeId", data.assuranceTypeId.toString());
      formData.append("userId", data.userId);
      formData.append("paidDate", paidDate?.toString() as string);
      formData.append("yearlyFee", data.yearlyFee.toString());
      formData.append("contractingClient", data.contractingClient);
      formData.append("periodicity", data.periodicity);
      formData.append("paidFee", data.paidFee.toString());
      formData.append("insuredCostumer", data.insuredCostumer);
      formData.append("emissionDate", emissionDate?.toString() as string);

      try {
        callback?.(formData);
      } catch (err) {
        console.error(err);
      }
    } else {
      Swal.fire({
        title: "Error!",
        text: `No seleccionaste archivo.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // const sendData = (data: FormValues) => {

  //   if (callback) {
  //     callback({
  //       ...data,
  //       paidDate: paidDate,
  //       emissionDate: emissionDate,

  //     });
  //   }
  //   }
  // };

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
        paidFee: 0,
        insuredCostumer: "",
      });
      setPaidDate(new Date());
      setEmissionDate(new Date());
    } else if (error) {
      console.log({ error });
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
    <div className="m-4 grid w-11/12 grid-cols-4 rounded-lg bg-gradient-to-t from-[#DBDFE6] to-[#FFEFDB] shadow-lg">
      <img
        src={moneyGrowth}
        alt="Imagen"
        className="hidden rounded-l-lg object-cover md:block md:h-full"
      />
      <div className="grid-cols col-span-3 grid w-full rounded-l-lg md:col-span-3 md:w-full">
        <div className="col flex items-center justify-center rounded-t-lg bg-orange-500 p-4 md:rounded-tr-lg">
          <h1 className="my-2 text-3xl font-bold text-white">Agregar venta</h1>
        </div>
        <div className="col grid grid-cols-3">
          <div className="col-span-1 px-6 pt-8 md:col-span-1">
            {/* 1st column */}
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
              Nombre del asegurado
            </label>
            <input
              className="input-primary w-full"
              placeholder="Ingrese el nombre de asegurado"
              {...register("insuredCostumer", {
                required: "El campo Nombre de Asegurado es requerido",
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
            <label className="ml-3 mb-1 block text-lg font-bold text-gray-700">
              Nombre del Contratante
            </label>
            <input
              className="input-primary w-full"
              placeholder="Ingrese el nombre del contratante"
              {...register("contractingClient", {
                required: "El campo Nombre del contratante es requerido",
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
          {/* 2nd column */}
          <div className="col-span-1 px-6 pt-8 md:col-span-1">
            <label
              htmlFor="datePicker"
              className="ml-3 mb-1 block text-lg font-bold text-gray-700"
            >
              Fecha Emisión
            </label>
            <DatePicker
              selected={emissionDate}
              name="datePicker"
              id="datePicker"
              onChange={(date: Date | null) => setEmissionDate(date)}
              dateFormat="dd/MM/yyyy"
              className="input-primary w-full"
              placeholderText="dd/mm/aaaa"
              required
            />
            <label className="ml-3 mb-1 block text-lg font-bold text-gray-700">
              Prima Anual
            </label>
            <input
              className="input-primary w-full"
              type="number"
              placeholder="Ingrese la prima anual"
              {...register("yearlyFee", {
                required: "El campo de prima anual es requerido",
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
              Periodicidad
            </label>
            <select
              className="input-primary w-full"
              {...register("periodicity", {
                required: "El campo periodicidad es requerido",
              })}
            >
              <option value={"Mensual"}> Mensual </option>
              <option value={"Trimestral"}> Trimestral </option>
              <option value={"Semestral"}> Semestral </option>
              <option value={"Anual"}> Anual </option>
            </select>
          </div>
          {/* 3rd column */}
          <div className="col-span-1 px-6 pt-8 md:col-span-1">
            <label className="ml-3 mb-1 block text-lg font-bold text-gray-700">
              Fecha Pago
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
              Prima Pagada
            </label>
            <input
              className="input-primary w-full"
              type="number"
              placeholder="Ingrese la prima pagada"
              {...register("paidFee", {
                required: "El campo prima pagada es requerido",
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
              Tipo Seguro
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
          </div>

          {/* 4th column */}
          <div className="col-span-2 mb-4 px-6 pt-8 ">
            {/* File zone */}
            <FileInput
              id="file"
              onChange={(e) => {
                if (e.target.files) {
                  setFile(e.target.files[0]);
                } else setFile(null);
              }}
              helperText="Sube la evidencia de tu venta"
            />
          </div>
          <div className="col-span-1 px-6 pt-8 md:col-span-1">
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
  );
};

export default CardNewSale;
