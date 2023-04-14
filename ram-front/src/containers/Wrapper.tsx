// (c) Delta Software 2023, rights reserved.

import Foot from "../components/includes/Footer/Foot";
import NavBar from "../components/includes/NavBar/NavBar";

export interface IWrapperProps {
  children: JSX.Element;
}

const Wrapper = ({ children }: IWrapperProps): JSX.Element => {
  return (
    <main className="h-screen overflow-y-auto">
      <NavBar />
      {children}
      <Foot />
    </main>
  );
};

export default Wrapper;
