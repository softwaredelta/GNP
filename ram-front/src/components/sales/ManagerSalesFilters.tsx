// (c) Delta Software 2023, rights reserved.
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { IAssuranceType, IUser } from "../../types";

interface IFiltersSales {
  policyNumber: string;
  periodicity: string;
  assuranceTypeId: string;
  contractingClient: string;
  status: string;
  userId: string;
}

const currentDate = new Date();
const currentDateMinusOneWeek = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  currentDate.getDate() - 7,
);

export interface IManagerSalesFilters {
  updateSales: (newBody?: object) => Promise<boolean>;
  assuranceTypes: IAssuranceType[];
  agents: IUser[];
}

export default function ManagerSalesFilters({
  updateSales,
  assuranceTypes,
  agents,
}: IManagerSalesFilters) {
  const [dateInit, setDateInit] = useState<Date | null>(
    currentDateMinusOneWeek,
  );
  const [dateEnd, setDateEnd] = useState<Date | null>(currentDate);
  const { register, handleSubmit } = useForm<IFiltersSales>();
  return (
    <div className="grid w-full grid-cols-4 gap-x-5  pb-5">
      <div>
        <label className="label-primary">Agente</label>
        <select
          className="input-primary"
          {...register("userId")}
          defaultValue=""
        >
          <option value="">Todos</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {`${agent.name} ${agent.lastName}`}
            </option>
          ))}
        </select>
      </div>
      <div className="">
        <label className="label-primary">Nombre del cliente</label>
        <input
          type="text"
          className="input-primary"
          {...register("contractingClient")}
        />
      </div>
      <div className="">
        <label className="label-primary">Poliza</label>
        <input
          type="text"
          className="input-primary"
          {...register("policyNumber")}
        />
      </div>
      <div>
        <label className="label-primary">Fecha de Pago Inicio</label>
        <DatePicker
          selected={dateInit}
          name="datePicker"
          id="datePicker"
          onChange={(date: Date | null) => setDateInit(date)}
          dateFormat="dd/MM/yyyy"
          className="input-primary"
          placeholderText="dd/mm/aaaa"
          required
        />
      </div>
      <div>
        <label className="label-primary">Fecha de Pago Fin</label>
        <DatePicker
          selected={dateEnd}
          name="datePicker"
          id="datePicker"
          onChange={(date: Date | null) => setDateEnd(date)}
          dateFormat="dd/MM/yyyy"
          className="input-primary"
          placeholderText="dd/mm/aaaa"
          required
        />
      </div>
      <div className="">
        <label className="label-primary">Tipo de seguro</label>
        <select
          className="input-primary"
          {...register("assuranceTypeId")}
          defaultValue=""
        >
          <option value="">Todos</option>
          {assuranceTypes.map((assuranceType) => (
            <option key={assuranceType.id} value={assuranceType.id}>
              {assuranceType.name}
            </option>
          ))}
        </select>
      </div>
      <div className="">
        <label className="label-primary">Periodicidad</label>
        <select
          className="input-primary"
          {...register("periodicity")}
          defaultValue=""
        >
          <option value="">Todos</option>
          <option value={"Mensual"}> Mensual </option>
          <option value={"Trimestral"}> Trimestral </option>
          <option value={"Semestral"}> Semestral </option>
          <option value={"Anual"}> Anual </option>
        </select>
      </div>
      <div className="">
        <label className="label-primary">Estado</label>
        <select
          className="input-primary"
          {...register("status")}
          defaultValue=""
        >
          <option value="">Todos</option>
          <option value="Sin revisar">Sin revisar</option>
          <option value="Rechazada">Rechazada</option>
          <option value="Aceptada">Aceptada</option>
        </select>
      </div>
      <div className=" col-span-2 col-start-2 w-1/2 place-self-center">
        <button
          className="btn-primary"
          onClick={handleSubmit((data) => {
            updateSales({
              ...data,
              startDate: dateInit,
              endDate: dateEnd,
            });
          })}
        >
          Filtrar
        </button>
      </div>
    </div>
  );
}
