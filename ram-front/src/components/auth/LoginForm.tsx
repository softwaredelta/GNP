// (c) Delta Software 2023, rights reserved.

import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import LogoRAM from "../../assets/imgs/Ram_LogoInv.png";

function LoginForm({
  onLogin,
  isLoading,
}: {
  onLogin: (params: { username: string; password: string }) => void;
  isLoading: boolean;
}) {
  const [passwordVisible, setpasswordVisible] = useState<boolean>(false);

  const handlePasswordVisibility = (): void => {
    setpasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex h-full w-full items-start bg-slate-200">
      <form
        className="flex h-auto w-full flex-col items-center rounded-xl bg-slate-200"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onLogin({
            username: formData.get("username") as string,
            password: formData.get("password") as string,
          });
        }}
      >
        <img
          src={LogoRAM}
          alt="Logo de Grupo Asesores RAM"
          className="mb-4 mt-9 w-48"
        />

        {/* Divider */}
        <div className="mx-auto mb-4 w-9/12 border-b-2 border-gray-500  "></div>
        <h1 className="mb-9 text-xl font-bold text-gnp-blue-500 ">
          ¡Bienvenido al Portal de RAM!
        </h1>
        <label className="w-9/12 justify-between text-sm font-bold text-[#424242] ">
          Nombre de Usuario
        </label>
        <input className="input-primary w-[79%]" type="email" name="username" />

        <div className="flex w-9/12 justify-between">
          <label className=" text-sm font-bold text-[#424242]">
            Contraseña
          </label>

          <a href="#" className="ml-1 text-xs text-gray-600 underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <div className="relative flex w-full justify-center">
          <input
            className="input-primary w-[79%] pr-10"
            type={passwordVisible ? "text" : "password"}
            name="password"
          />
          <button
            type="button"
            onClick={handlePasswordVisibility}
            className="absolute right-[15%] top-3 focus:outline-none"
          >
            {passwordVisible ? (
              <AiFillEye size={20} color="#012356" />
            ) : (
              <AiFillEyeInvisible size={20} color="#012356" />
            )}
          </button>
        </div>

        <button
          className="active:translate-y- mt-16 w-56 transform items-center justify-center rounded-xl bg-gnp-blue-500 py-2 px-4 font-bold uppercase text-white shadow-md transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-gnp-blue-700 hover:shadow-lg active:scale-95 "
          type="submit"
          disabled={isLoading}
        >
          Login
        </button>

        {/* No tienes cuenta? */}
        <div className=" mt-4  w-56">
          <p className="text-center text-sm text-black">
            ¿No tienes cuenta? Solicita una cuenta
            <a href="#" className="ml-1 text-sm text-gnp-blue-300">
              aquí.
            </a>{" "}
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
