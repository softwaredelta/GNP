// (c) Delta Software 2023, rights reserved.

import LoginForm from "./LoginForm";

import LogoGNP from "../../assets/imgs/GNP_LOGO.png";
import vivir from "../../assets/imgs/VIVIR.png";
import FooterAnimated from "../includes/Footer/FooterAnimated";

export const LoginScreen = ({
  onLogin,
  isLoading,
}: {
  onLogin: (params: { username: string; password: string }) => void;
  isLoading: boolean;
}) => {
  return (
    <>
      <div className=" bg-slate-50 h-screen w-screen grid md:grid-cols-2 grid-cols-1 ">
        <div className="hidden md:flex flex-col justify-between items-center ">
          <div className="flex items-center justify-between px-5 pt-5 w-full">
            <img className="w-48 " src={LogoGNP} alt="Logo GNP" />
            <img className="w-[25%] " src={vivir} alt="Vivir es increíble" />
          </div>
          <div className="w-full">
            <FooterAnimated />
          </div>
        </div>
        <div className="w-full">
          <LoginForm onLogin={onLogin} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
};
