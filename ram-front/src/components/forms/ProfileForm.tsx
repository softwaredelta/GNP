// (c) Delta Software 2023, rights reserved.
import { ILink, IUser } from "../../types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { TbSend } from "react-icons/tb";
import LinkList from "../generics/lists/LinkList";
import ProfileCard from "../generics/cards/ProfileCard";
import { MdLockReset } from "react-icons/md";

export interface IUserFormProps {
  initialUser: IUser;
  handlePost: (data: { form: IUser; file: File | null | string }) => void;
  onTogglePassword: () => void;
  handleLinkPost: (data: { link: string; name: string }) => void;
  handleLinkDelete: (id: string) => void;
  handleLinkEdit: (data: ILink) => void;
  links: ILink[];
}

export default function ProfileForm({
  initialUser = {
    id: "",
    name: "",
    email: "",
    lastName: "",
    password: "",
    mobile: 5555555555,
    confirmPassword: "",
    role: "regular",
    urlPP200: "",
    CUA: "",
  },
  handlePost,
  onTogglePassword,
  handleLinkPost,
  handleLinkDelete,
  handleLinkEdit,
  links,
}: IUserFormProps) {
  const { register, handleSubmit, reset } = useForm<IUser>({
    defaultValues: {
      ...initialUser,
    },
  });

  const [file, setFile] = useState<File | null | string>(
    initialUser.imageUrl || null,
  );

  return (
    <div className="mx-6 mt-12 mb-4 grid grid-flow-col grid-rows-6 gap-8">
      <div className="col row-span-5">
        <ProfileCard
          user={initialUser}
          fileChanged={(fileSelected) => {
            setFile(fileSelected);
          }}
        />
      </div>
      <div className="col-span-2 row-span-6">
        <div className="grid grid-flow-col grid-rows-4 gap-8">
          <div className="col row-span-3">
            <label className="ml-3 mb-1 block text-lg font-bold">Nombre</label>
            <input
              className="input-primary w-full"
              placeholder="Ingrese el nombre"
              type="text"
              {...register("name", {
                required: "El campo de nombre es requerido",
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
            <label className="ml-3 mb-1 block text-lg font-bold">
              Apellidos
            </label>
            <input
              className="input-primary w-full"
              placeholder="Ingrese el apellido"
              {...register("lastName", {
                required: "El campo de apellido es requerido",
                minLength: {
                  value: 3,
                  message: "El apellido debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "El apellido debe tener máximo 50 caracteres",
                },
              })}
            />
            <label className="ml-3 mb-1 block text-lg font-bold">Clave</label>
            <input
              className="input-primary w-full"
              placeholder="Ingrese la clave de agente"
              {...register("CUA", {
                required: "El campo de clave es requerido",
              })}
            />
          </div>
          <div className="col row flex justify-center">
            <div className="w-4/5">
              <button
                className="btn-primary flex h-12 items-center justify-center"
                onClick={onTogglePassword}
              >
                <span className="text-md font-semibold">
                  Reestablecer contraseña
                </span>
                <MdLockReset size={25} className="ml-2" />
              </button>
            </div>
          </div>
          <div className="col row-span-3">
            <label className="ml-3 mb-1 block text-lg font-bold">
              Teléfono
            </label>
            <input
              className="input-primary w-full"
              placeholder="Ingrese el número telefónico"
              type="number"
              {...register("mobile", {
                required: "El campo de teléfono es requerido",
              })}
            />

            <label className="ml-3 mb-1 block text-lg font-bold">Correo</label>
            <input
              className="input-primary w-full"
              placeholder="Ingrese el correo electrónico"
              {...register("email", {
                required: "El campo de correo es requerido",
              })}
            />
          </div>
          <div className="row-span col flex justify-center">
            <div className="w-4/5">
              <button
                className="btn-secondary flex h-12 items-center justify-center"
                onClick={handleSubmit(
                  (form) => {
                    handlePost({ form, file });
                    reset();
                  },
                  (errorsFields) => {
                    Swal.fire({
                      title: "Error!",
                      text: `Ocurrió un error al modificar el usuario.\n
                  ${Object.values(errorsFields).map((e) => e.message + " ")}`,
                      icon: "error",
                      confirmButtonText: "OK",
                    });
                  },
                )}
              >
                <span className="text-lg font-semibold">Guardar</span>
                <TbSend size={20} className="ml-2" />
              </button>
            </div>
          </div>

          <div className="col row-span-4">
            <div className="h-96">
              <LinkList
                links={links}
                handlePost={(link, name) => {
                  handleLinkPost({ link, name });
                }}
                handleDelete={(id) => handleLinkDelete(id)}
                handleEdit={(id, name, link) =>
                  handleLinkEdit({ id, name, link })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
