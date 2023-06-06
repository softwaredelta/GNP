// (c) Delta Software 2023, rights reserved.

import { useLocation } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import Foot from "../components/includes/Footer/Foot";
import NavBar from "../components/includes/NavBar/NavBar";
import { useAuthentication } from "../lib/api/api-auth";

export interface IWrapperProps {
  children: JSX.Element;
  title?: string;
}

const Wrapper = ({ children, title }: IWrapperProps): JSX.Element => {
  const { logout, auth, refresh } = useAuthentication();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <main className="flex min-h-screen flex-col justify-between overflow-y-auto">
      <NavBar
        onLogout={logout}
        user={auth}
        role={auth?.roles[0]}
        refresh={refresh}
      />
      {!isHomePage && title && (
        <div className="flex w-full items-center justify-between pt-8">
          <h1 className=" rounded-r-2xl bg-gnp-orange-500 py-3 px-20 text-xl font-bold text-white">
            {title}
          </h1>
          <div className="mx-6 my-2">
            <BackButton />
          </div>
        </div> // Muestra el botón de regreso solo si no es la página de inicio
      )}
      <div className="">{children}</div>
      <Foot />
    </main>
  );
};

export default Wrapper;
