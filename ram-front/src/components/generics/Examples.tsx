// (c) Delta Software 2023, rights reserved.

import Card from "./cards/base/Card";
import DeliveryCard from "./cards/DeliveryCard";
import CardInfoAssurence from "./cards/info/CardInfoAssurence";
import CardInfoTopFive from "./cards/info/CardInfoTopFive";
import ProgressBar from "./ProgressBar";

import { BsHouses } from "react-icons/bs";
import { IoPawSharp } from "react-icons/io5";

export default function Examples() {
  return (
    <div className="w-full min-h-[50vh] grid md:grid-cols-3 place-items-center py-20">
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
      <div className="col-start-1 w-7/12 py-10">
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
                amount: 200000,
              },
              {
                name: "Alfonso Cuarón",
                amount: 200000,
              },
              {
                name: "Alfonso Cuarón",
                amount: 200000,
              },
              {
                name: "Alfonso Cuarón",
                amount: 200000,
              },
              {
                name: "Alfonso Cuarón",
                amount: 200000,
              },
            ]}
          />
        </Card>
      </div>

      <div className=" w-7/12 py-10">
        <button className="floating-button">Hola</button>
      </div>
      <div className="md:col-span-3 ">
        <DeliveryCard
          color="blue"
          nameDelivery="Nombre de la entrega"
          status="Sin enviar"
          image="https://i.blogs.es/799a0e/ydray-mew_27_articuno_45l_hyperx_environment_front/1366_2000.jpeg"
        />
      </div>
    </div>
  );
}
