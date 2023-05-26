// (c) Delta Software 2023, rights reserved.
import DatePicker from "react-datepicker";
import { IAssuranceType, ISell } from "../../types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import moneyGrowth from "../../assets/imgs/moneyGrowth.png";
import Swal from "sweetalert2";
import { FileInput } from "flowbite-react";
import { TbSend } from "react-icons/tb";
import "react-datepicker/dist/react-datepicker.css";

export interface ISaleFormProps {
  assuranceTypes: IAssuranceType[];
  initialSell?: ISell;
  isEdit: boolean;
  handlePost: (data: {
    form: ISell;
    paidDate: Date | null;
    emissionDate: Date | null;
    file: File | null | string;
  }) => void;
}

export default function SaleForm({
  assuranceTypes,
  initialSell = {
    policyNumber: "",
    yearlyFee: "",
    contractingClient: "",
    status: "",
    periodicity: "Mensual",
    evidenceUrl: "",
    insuredCostumer: "",
    paidFee: "",
    assuranceTypeId: assuranceTypes[0].id,
  },
  isEdit = false,
  handlePost,
}: ISaleFormProps) {
  const { register, handleSubmit, reset } = useForm<ISell>({
    defaultValues: {
      ...initialSell,
    },
  });

  const [paidDate, setPaidDate] = useState<Date | null>(
    initialSell.paidDate ? new Date(initialSell.paidDate) : new Date(),
  );
  const [emissionDate, setEmissionDate] = useState<Date | null>(
    initialSell.emissionDate ? new Date(initialSell.emissionDate) : new Date(),
  );
  const [file, setFile] = useState<File | null | string>(
    initialSell.evidenceUrl || null,
  );

  return (
    <div className="m-4 grid w-11/12 grid-cols-4 rounded-lg bg-gradient-to-t from-[#DBDFE6] to-[#FFEFDB] shadow-lg">
      <img
        src={moneyGrowth}
        alt="Imagen"
        className="hidden rounded-l-lg object-cover md:block md:h-full"
      />
      <div className="grid-cols col-span-3 grid w-full rounded-l-lg md:col-span-3 md:w-full">
        <div className="col flex items-center justify-center rounded-t-lg bg-orange-500 p-4 md:rounded-tr-lg">
          <h1 className="my-2 text-3xl font-bold text-white">
            {isEdit ? "Editar " : "Agregar "}venta
          </h1>
        </div>
        <div className="col grid grid-cols-3">
          <div className="col-span-1 px-6 pt-8 md:col-span-1">
            <label className="ml-3 mb-1 block text-lg font-bold text-gray-700">
              Póliza
            </label>
            <input
              className="input-primary w-full"
              placeholder="Ingrese el número de póliza"
              type="text"
              {...register("policyNumber", {
                required: "El campo poliza es requerido",
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
              defaultValue={initialSell.periodicity}
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
              defaultValue={assuranceTypes[0].id}
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

          <div className="col-span-2 mb-4 flex flex-col justify-center px-6 ">
            {typeof file === "string" && (
              <div className="py-2">
                <label htmlFor="" className="label-primary font-bold">
                  {"Esta venta ya tiene archivo: "}
                </label>
                <a
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" text-gnp-blue-600 underline"
                >
                  {" Click aquí para verlo"}
                </a>
              </div>
            )}
            <FileInput
              id="file"
              className="w-full"
              onChange={(e: any) => {
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
              onClick={handleSubmit(
                (form) => {
                  handlePost({ form, emissionDate, file, paidDate });
                  reset();
                },
                (errorsFields) => {
                  Swal.fire({
                    title: "Error!",
                    text: `Ocurrió un error al registrar la venta.\n
                  ${Object.values(errorsFields).map((e) => e.message + " ")}`,
                    icon: "error",
                    confirmButtonText: "OK",
                  });
                },
              )}
            >
              <span className="text-lg font-semibold"> Enviar </span>
              <TbSend size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
