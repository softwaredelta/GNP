// (c) Delta Software 2023, rights reserved.

import Foot from "../components/includes/Footer/Foot";
import NavBar from "../components/includes/NavBar/NavBar";
import { useAuthentication } from "../lib/api/api-auth";

export interface IWrapperProps {
  children: JSX.Element;
}

const Wrapper = ({ children }: IWrapperProps): JSX.Element => {
  const { logout, auth } = useAuthentication();

  return (
    <main className="min-h-screen flex flex-col justify-between overflow-y-auto">
      <NavBar
        onLogout={logout}
        username={auth?.username}
        useremail={auth?.username}
        role={auth?.roles[0]}
      />
      <div className="">{children}</div>
      <Foot />
    </main>
  );
};

export default Wrapper;
