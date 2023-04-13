import Card from "./Card";
import CardInfoAssurence from "./CardInfoAssurence";
import CardInfoTopFive from "./CardInfoTopFive";
import CarouselCard from "./CarouselCard";
import ProgressBar from "./ProgressBar";

import { BsHouses } from "react-icons/bs";
import { IoPawSharp } from "react-icons/io5";

export default function Examples() {
  return (
    <div className="w-full min-h-[50vh] grid grid-cols-3 place-items-center py-20">
      <div className=" w-7/12 py-10">
        <ProgressBar
          progress={30}
          color="gnp-primary-blue"
          bgColor="gnp-light-blue"
          txColor="white"
        />

        <ProgressBar
          progress={80}
          color="gnp-primary-orange"
          bgColor="gnp-light-orange"
          txColor="white"
        />
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
          color="primary-orange"
          icon={<BsHouses color="white" size={30} />}
        >
          <CardInfoAssurence
            typeAssurance="Seguro de hogar"
            color="primary-orange"
            total={2000000}
          />
        </Card>
      </div>
      <div className=" w-8/12 py-10">
        <Card
          image="https://animals.sandiegozoo.org/sites/default/files/2020-08/black-footed.jpg"
          color="primary-blue"
          icon={<IoPawSharp color="white" size={30} />}
        >
          <CardInfoTopFive
            typeAssurance="Seguro de mascotas"
            color="primary-blue"
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
      <div className=" w-7/12 py-10">{/* <CarouselCard /> */}</div>
    </div>
  );
}
