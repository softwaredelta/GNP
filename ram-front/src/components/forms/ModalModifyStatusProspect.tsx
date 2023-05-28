// (c) Delta Software 2023, rights reserved.

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import { IStatus } from "../../types";
import Modal from "../generics/Modal";

export interface FormValues {
  statusId: string;
  statusComment: string;
}

export interface IModalModifyStatusProspectProps {
  prospectName: string;
  prospectId: string;
  handleModifyStatus: (data: FormValues) => void;
  closeModal: VoidFunction;
  isOpenModal: boolean;
  listStatus?: IStatus[];
}

export default function ModalModifyStatusProspect({
  prospectId,
  prospectName,
  handleModifyStatus,
  closeModal,
  isOpenModal,
  listStatus = [],
}: IModalModifyStatusProspectProps) {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const { response, error, callback } = useAxios({
    url: `prospect/update-prospect/${prospectId}`,
    method: "POST",
  });

  const handleUpdateProspect = (data: FormValues) => {
    try {
      callback?.(data);
      handleModifyStatus(data);
      closeModal();
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "Éxito!",
        text: `Se modificó el estado del prospecto correctamente.`,
        icon: "success",
        confirmButtonText: "OK",
      });
      reset({
        statusId: "",
        statusComment: "",
      });
      closeModal();
    } else if (error) {
      Swal.fire({
        title: "Error!",
        text: `Ocurrió un error al modificar el estado del prospecto.`,
        icon: "error",
        confirmButtonText: "OK",
        footer: `<span>${error}</span>`,
      });
    }
  }, [response, error]);

  return (
    <>
      {isOpenModal && (
        <Modal
          withModal={false}
          closeModal={() => {
            closeModal();
            reset();
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-3/5 rounded-3xl bg-gnp-white p-10"
          >
            <h1 className="apply w-full rounded-xl bg-gnp-orange-500 p-4 text-center text-2xl font-semibold text-white">
              {prospectName}
            </h1>
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center space-y-3">
                <label className="text-xl font-semibold">Estado</label>
                <select
                  className="input-primary w-10/12"
                  {...register("statusId", {
                    required: "El campo Estado es requerido",
                  })}
                >
                  {listStatus.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.statusName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col items-center justify-center space-y-3">
                <label className="text-xl font-semibold">Comentario</label>
                <div className="h-40 w-10/12">
                  <textarea
                    {...register("statusComment")}
                    className="text-area-primary resize-none"
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-center space-x-4">
              <button
                className="btn-border"
                onClick={() => {
                  closeModal();
                  reset();
                }}
              >
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={handleSubmit(handleUpdateProspect, (errorsFields) => {
                  Swal.fire({
                    title: "Error!",
                    text: `Ocurrió un error al modificar el estado del prospecto.
                    \n${Object.values(errorsFields).map(
                      (e) => e.message + " ",
                    )}`,

                    icon: "error",
                    confirmButtonText: "OK",
                  });
                })}
              >
                Guardar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
