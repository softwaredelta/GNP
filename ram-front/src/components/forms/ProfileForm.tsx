// (c) Delta Software 2023, rights reserved.
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdLockReset } from "react-icons/md";
import { TbSend } from "react-icons/tb";
import Swal from "sweetalert2";
import { ILink, IUser } from "../../types";
import ProfileCard from "../generics/cards/ProfileCard";
import LinkList from "../generics/lists/LinkList";

export interface IUserFormProps {
  initialUser: IUser;
  handlePost?: (data: { form: IUser; file: File | null | string }) => void;
  onTogglePassword?: () => void;
  handleLinkPost?: (data: { link: string; name: string }) => void;
  handleLinkDelete?: (id: string) => void;
  handleLinkEdit?: (data: ILink) => void;
  links: ILink[];
  isEdit?: boolean;
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
  isEdit = true,
}: IUserFormProps) {
  const { register, handleSubmit, reset, watch } = useForm<IUser>({
    defaultValues: {
      ...initialUser,
    },
  });

  const [file, setFile] = useState<File | null | string>(
    initialUser.imageUrl || null,
  );
  const formValues = watch();

  return (
    <div className="mx-6 mt-12 mb-1 grid grid-flow-col grid-rows-6 gap-8">
      <div className="col row-span-6">
        <div className="lg:max-w-xs">
          <ProfileCard
            user={formValues}
            fileChanged={(fileSelected) => {
              setFile(fileSelected);
            }}
            isEdit={isEdit}
          />
        </div>
      </div>
      <div className="col-span-2 row-span-6">
        <div className="grid grid-flow-col grid-rows-4 gap-8">
          {isEdit ? (
            <>
              <div className="col row-span-3">
                <label className="ml-3 mb-1 block text-lg font-bold">
                  Nombre
                </label>
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
                <label className="ml-3 mb-1 block text-lg font-bold">
                  Clave
                </label>
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

                <label className="ml-3 mb-1 block text-lg font-bold">
                  Correo
                </label>
                <input
                  className="input-primary w-full"
                  placeholder="Ingrese el correo electrónico"
                  {...register("email", {
                    required: "El campo de correo es requerido",
                  })}
                />

                <label className="ml-3 mb-1 block text-lg font-bold">
                  PP200
                </label>
                <input
                  className="input-primary w-full"
                  placeholder="Ingrese el link al PP200"
                  type="text"
                  {...register("urlPP200")}
                />
              </div>
              <div className="row-span col flex justify-center">
                <div className="w-4/5">
                  <button
                    className="btn-secondary flex h-12 items-center justify-center"
                    onClick={handleSubmit(
                      (form) => {
                        if (handlePost) handlePost({ form, file });
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
            </>
          ) : (
            <div className="col row-span-3">
              <dl className="max-w-md divide-y divide-gray-200 text-gray-900 dark:divide-gray-700 dark:text-white">
                <div className="flex flex-col pb-3">
                  <dt className="mb-1 text-gray-500 dark:text-gray-400 md:text-lg">
                    Nombre
                  </dt>
                  <dd className="text-lg font-semibold">
                    {initialUser.name + " " + initialUser.lastName}
                  </dd>
                </div>
                <div className="flex flex-col py-3">
                  <dt className="mb-1 text-gray-500 dark:text-gray-400 md:text-lg">
                    Email
                  </dt>
                  <dd className="text-lg font-semibold">{initialUser.email}</dd>
                </div>
                <div className="flex flex-col pt-3">
                  <dt className="mb-1 text-gray-500 dark:text-gray-400 md:text-lg">
                    Clave de Agente
                  </dt>
                  <dd className="text-lg font-semibold">
                    {initialUser.CUA || "No tiene ligada una clave"}
                  </dd>
                </div>
                <div className="flex flex-col pt-3">
                  <dt className="mb-1 text-gray-500 dark:text-gray-400 md:text-lg">
                    Teléfono
                  </dt>
                  <dd className="text-lg font-semibold">
                    {initialUser.mobile}
                  </dd>
                </div>
                <div className="flex flex-col pt-3">
                  <dt className="mb-1 text-gray-500 dark:text-gray-400 md:text-lg">
                    PP200
                  </dt>
                  <dd className="text-lg font-semibold">
                    {(
                      <div
                        className="cursor-pointer text-blue-500 underline hover:text-blue-700"
                        onClick={() => {
                          window.open(initialUser.urlPP200, "_blank");
                        }}
                      >
                        {" "}
                        Link al PP200
                      </div>
                    ) || "No tienes ligado tu PP200"}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          <div className="col row-span-4">
            <div className="h-96">
              {isEdit ? (
                <LinkList
                  links={links}
                  handlePost={(link, name) => {
                    if (handleLinkPost) handleLinkPost({ link, name });
                  }}
                  handleDelete={(id) => {
                    if (handleLinkDelete) handleLinkDelete(id);
                  }}
                  handleEdit={(id, name, link) => {
                    if (handleLinkEdit) handleLinkEdit({ id, name, link });
                  }}
                  isEdit={isEdit}
                />
              ) : (
                <LinkList links={links} isEdit={isEdit} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
