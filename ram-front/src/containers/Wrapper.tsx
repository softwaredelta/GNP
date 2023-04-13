import { Children } from "react";
import Foot from "../components/includes/Footer/Foot";
import NavBar from "../components/includes/NavBar/NavBar";

type Props = {};

const Wrapper = ({ children }: any): JSX.Element => {
  return (
    <main className="h-screen overflow-y-auto">
      <NavBar />
      {children}
      <Foot />
    </main>
  );
};

export default Wrapper;
