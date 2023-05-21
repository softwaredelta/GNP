// (c) Delta Software 2023, rights reserved.

import { useLocation } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import Foot from "../components/includes/Footer/Foot";
import NavBar from "../components/includes/NavBar/NavBar";
import { useAuthentication } from "../lib/api/api-auth";

export interface IWrapperProps {
  children: JSX.Element;
}

const Wrapper = ({ children }: IWrapperProps): JSX.Element => {
  const { logout, auth } = useAuthentication();
  const location = useLocation();
  const isHomePage = location.pathname === "/"; // Verifica si es la página de inicio (Home)
  const isGroupsPage = location.pathname === "/groups"; // Verifica si es la página de grupos (Groups)

  return (
    <main className="flex min-h-screen flex-col justify-between overflow-y-auto">
      <NavBar
        onLogout={logout}
        username={auth?.username}
        useremail={auth?.username}
        role={auth?.roles[0]}
      />
      {!isHomePage &&
        !isGroupsPage && ( // Muestra el botón de regreso solo si no es la página de inicio
          <div className="mx-6 my-2">
            <BackButton />
          </div>
        )}
      <div className="">{children}</div>
      <Foot />
    </main>
  );
};

export default Wrapper;
