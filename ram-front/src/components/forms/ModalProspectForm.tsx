// (c) Delta Software 2023, rights reserved.
import { useForm } from "react-hook-form";
import Modal from "../generics/Modal";
import Swal from "sweetalert2";
import { IStatus } from "../../types";

export interface FormValues {
  name: string;
  firstSurname: string;
  secondSurname: string;
  statusId: string;
  comentary: string;
}

export interface IModalProspectFormProps {
  handlePost: (data: FormValues) => void;
  closeModal: VoidFunction;
  isOpenModal: boolean;
  isEdit?: boolean;
  listStatus?: IStatus[];
}

export default function ModalProspectForm({
  handlePost,
  closeModal,
  isOpenModal,
  listStatus = [
    {
      id: "1",
      statusName: "Nuevo Prospecto",
      date: new Date(),
      comments: "Nuevo prospecto",
    },
    {
      id: "2",
      statusName: "Contactado",
      date: new Date(),
      comments: "Contactado",
    },
    {
      id: "3",
      statusName: "No Contactado",
      date: new Date(),
      comments: "No Contactado",
    },
  ],
  isEdit = false,
}: IModalProspectFormProps) {
  const { register, handleSubmit, reset } = useForm<FormValues>();

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
            className=" relative w-3/5 rounded-3xl bg-gnp-white p-10"
          >
            <h1 className="apply w-full rounded-xl bg-gnp-orange-500 p-4 text-center text-2xl font-semibold text-white">
              {isEdit ? "Editar" : "Agregar"} prospecto
            </h1>
            <div className="justify-beetwen mt-10 flex grid grid-cols-2 place-items-center gap-4 ">
              <div className="flex w-full flex-col items-center justify-center space-y-3">
                <label className="text-xl font-semibold">Nombre</label>
                <input
                  type="text"
                  className="input-primary w-10/12"
                  {...register("name", {
                    required: "El campo Nombre es requerido",
                  })}
                />
              </div>
              <div className="flex w-full flex-col items-center justify-center space-y-3">
                <label className="text-xl font-semibold">
                  Apellido Parterno
                </label>
                <input
                  type="text"
                  className="input-primary w-10/12"
                  {...register("firstSurname", {
                    required: "El campo Apellido Paterno es requerido",
                  })}
                />
              </div>
              <div className="flex w-full flex-col items-center justify-center space-y-3">
                <label className="text-xl font-semibold">
                  Apellido Materno
                </label>
                <input
                  type="text"
                  className="input-primary w-10/12"
                  {...register("secondSurname")}
                />
              </div>
              <div className="row-span-2 flex w-full flex-col items-center  justify-center space-y-3">
                <label className="text-xl font-semibold">Comentario</label>
                <div className="h-40 w-10/12">
                  <textarea
                    {...register("comentary")}
                    className="text-area-primary resize-none"
                  />
                </div>
              </div>
              <div className="flex w-full flex-col items-center justify-center space-y-3">
                <label className="text-xl font-semibold">Estado</label>
                <select
                  className="input-primary w-10/12"
                  {...register("statusId", {
                    required: "El campo Estado es requerido",
                  })}
                >
                  {listStatus?.map((status) => (
                    <option key={status.id} value={status.id}>
                      {" "}
                      {status.statusName}{" "}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-11/12 pt-5">
                <button
                  className="btn-border"
                  onClick={() => {
                    closeModal();
                    reset();
                  }}
                >
                  Cancelar
                </button>
              </div>
              <div className="w-11/12 pt-5">
                <button
                  className="btn-primary"
                  onClick={handleSubmit(handlePost, (errorsFields) => {
                    Swal.fire({
                      title: "¡Error!",
                      text: `Ocurrió un error al registrar el prospecto.\n
                        ${Object.values(errorsFields).map(
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
          </div>
        </Modal>
      )}
    </>
  );
}
