// (c) Delta Software 2023, rights reserved.

import Foot from "../components/includes/Footer/Foot";
import NavBar from "../components/includes/NavBar/NavBar";
import { useAuthentication } from "../lib/api/api-auth";

export interface IWrapperProps {
  children: JSX.Element;
}

const Wrapper = ({ children }: IWrapperProps): JSX.Element => {
  const { logout } = useAuthentication();

  return (
    <main className="h-screen overflow-y-auto">
      <NavBar onLogout={logout} />
      {children}
      <Foot />
    </main>
  );
};

export default Wrapper;
