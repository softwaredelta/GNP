import { Children } from "react";
import Foot from "../components/includes/Footer/Foot";
import NavBar from "../components/includes/NavBar/NavBar";

type Props = {};

const Wrapper = ({ children }: any): JSX.Element => {
  return (
    <main className="h-screen overflow-y-auto">
      <NavBar />
      <div className="container mx-auto grid text-gnp">
        <h1 className="text-4xl text-gnp-primary-blue">Hola Amigos</h1>
      </div>
      <Foot />
    </main>
  );
};

export default Wrapper;
