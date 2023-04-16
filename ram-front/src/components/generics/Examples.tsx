// (c) Delta Software 2023, rights reserved.

import Card from "./cards/base/Card";
import DeliveryCard from "./cards/DeliveryCard";
import CardInfoAssurence from "./cards/info/CardInfoAssurence";
import CardInfoTopFive from "./cards/info/CardInfoTopFive";
import ProgressBar from "./ProgressBar";
import DropZone from "./DropZone";
import CardInfoGroup from "./cards/info/CardInfoGroup";

import { BsHouses } from "react-icons/bs";
import { RiPencilFill } from "react-icons/ri";
import { IoPawSharp } from "react-icons/io5";

export default function Examples() {
  return (
    <div className="w-full min-h-[50vh] grid md:grid-cols-3 place-items-center gap-10 py-20">
      <div className=" w-7/12 py-10">
        <ProgressBar
          progress={30}
          textLabel="Ya tienen título las progress bar"
          color="orange"
        />

        <ProgressBar progress={80} color="blue" />
      </div>
      <div className="w-40">
        <button className="btn-primary">Botón primario</button>
      </div>
      <div className="w-40">
        <button className="btn-secondary">Botón secundario</button>
      </div>
      <div className="w-40">
        <input type="text" className="input-primary" />
      </div>
      <div className="w-40">
        <button className="btn-disabled">Hola amigos</button>
      </div>
      <div className="col-start-1 w-8/12 py-10">
        <Card
          image="https://imgs.search.brave.com/muR0HGm76B6gbdiwyaBULBApAqvAdlWv2aHFAsQYVUw/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJhY2Nlc3Mu/Y29tL2Z1bGwvNTA4/OTUyOC5qcGc"
          color="orange"
          icon={<BsHouses color="white" size={30} />}
        >
          <CardInfoAssurence
            typeAssurance="Seguro de hogar"
            color="orange"
            total={2000000}
          />
        </Card>
      </div>
      <div className=" w-8/12 py-10">
        <Card
          image="https://animals.sandiegozoo.org/sites/default/files/2020-08/black-footed.jpg"
          color="blue"
          icon={<IoPawSharp color="white" size={30} />}
        >
          <CardInfoTopFive
            typeAssurance="Seguro de mascotas"
            color="blue"
            top={[
              {
                name: "Alfonso Cuarón",
                amount: 20000,
              },
              {
                name: "Alfonso Cuarón",
                amount: 20000,
              },
              {
                name: "Alfonso Cuarón",
                amount: 20000,
              },
              {
                name: "Alfonso Cuarón",
                amount: 20000,
              },
              {
                name: "Alfonso Cuarón",
                amount: 20000,
              },
            ]}
          />
        </Card>
      </div>

      <div className=" w-full grid grid-cols-2 gap-10 p-12">
        <button className="floating-button-primary">
          {<RiPencilFill size={50} />}
        </button>
        <button className="floating-button-secondary">
          {<RiPencilFill size={50} />}
        </button>
      </div>
      <div className="md:col-span-3 ">
        <DeliveryCard
          color="blue"
          nameDelivery="Nombre de la entrega"
          status="Sin enviar"
          image="https://i.blogs.es/799a0e/ydray-mew_27_articuno_45l_hyperx_environment_front/1366_2000.jpeg"
        />
      </div>
      <div className="w-10/12">
        <DropZone />
      </div>
      <div className="w-7/12">
        <button
          className="hover:scale-105 transition-all ease-in-out active:scale-95 cursor-pointer"
          onClick={() => alert("Redireccionando al grupo ...")}
        >
          <Card
            color="blue"
            image="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg"
          >
            <CardInfoGroup
              color="blue"
              nameGroup="Los novinos chidos"
              progress={50}
            />
          </Card>
        </button>
      </div>
    </div>
  );
}
