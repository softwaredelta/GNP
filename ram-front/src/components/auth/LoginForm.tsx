// (c) Delta Software 2023, rights reserved.

import { FiEye, FiEyeOff } from "react-icons/fi";

import LogoRAM from "../../assets/imgs/Ram_LogoInv.png";
import usePasswordVisibility from "../../hooks/usePasswordVisibility";

function LoginForm({
  onLogin,
  isLoading,
}: {
  onLogin: (params: { username: string; password: string }) => void;
  isLoading: boolean;
}) {
  const { handlePasswordVisibility, typeInput, passwordVisible } =
    usePasswordVisibility();

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
          Correo Electrónico
        </label>
        <div className="w-[79%]">
          <input
            placeholder="ejemplo@ram.mx"
            className="input-primary"
            type="email"
            name="username"
          />
        </div>

        <div className="flex w-9/12 justify-between">
          <label className=" text-sm font-bold text-[#424242]">
            Contraseña
          </label>
        </div>

        <div className="relative flex w-[79%] justify-center">
          <input
            placeholder="***********"
            className="input-primary pr-10"
            type={typeInput()}
            name="password"
          />
          <button
            type="button"
            onClick={handlePasswordVisibility}
            className="absolute right-[7%] top-3 focus:outline-none"
          >
            {passwordVisible ? (
              <FiEye size={20} color="#012356" />
            ) : (
              <FiEyeOff size={20} color="#012356" />
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
      </form>
    </div>
  );
}

export default LoginForm;
