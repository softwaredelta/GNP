// (c) Delta Software 2023, rights reserved.

import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import LogoRAM from "../../assets/imgs/Ram_LogoInv.png";

function LoginForm({
  onLogin,
}: {
  onLogin: (params: { username: string; password: string }) => void;
}) {
  const [passwordVisible, setpasswordVisible] = useState<boolean>(false);

  const handlePasswordVisibility = (): void => {
    setpasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex w-full h-full items-start bg-slate-200">
      <form
        className="h-auto w-full flex flex-col items-center bg-slate-200 rounded-xl"
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
          className="w-48 mb-4 mt-9"
        />

        {/* Divider */}
        <div className="border-b-2 border-gray-500 w-9/12 mx-auto mb-4  "></div>
        <h1 className="text-xl text-gnp-blue-500 font-bold mb-9 ">
          ¡Bienvenido al Portal de RAM!
        </h1>
        <label className="text-[#424242] text-sm font-bold justify-between w-9/12 ">
          Nombre de Usuario
        </label>
        <input className="input-primary w-[79%]" type="email" name="username" />

        <div className="flex justify-between w-9/12">
          <label className=" text-[#424242] text-sm font-bold">
            Contraseña
          </label>

          <a href="#" className="text-gray-600 text-xs ml-1 underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <div className="relative w-full flex justify-center">
          <input
            className="input-primary pr-10 w-[79%]"
            type={passwordVisible ? "text" : "password"}
            name="password"
          />
          <button
            type="button"
            onClick={handlePasswordVisibility}
            className="focus:outline-none absolute right-[15%] top-3"
          >
            {passwordVisible ? (
              <AiFillEye size={20} color="#012356" />
            ) : (
              <AiFillEyeInvisible size={20} color="#012356" />
            )}
          </button>
        </div>

        <button
          className="uppercase items-center justify-center mt-16 w-56 bg-gnp-blue-500 hover:bg-gnp-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transform transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 active:scale-95 active:translate-y- "
          type="submit"
        >
          Login
        </button>

        {/* No tienes cuenta? */}
        <div className=" w-56  mt-4">
          <p className="text-black text-sm text-center">
            ¿No tienes cuenta? Solicita una cuenta
            <a href="#" className="text-gnp-blue-300 text-sm ml-1">
              aquí.
            </a>{" "}
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
