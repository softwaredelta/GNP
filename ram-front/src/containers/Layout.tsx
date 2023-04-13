import Wrapper from "./Wrapper";
import CardInfoAssurence from "../components/generics/CardInfoAssurence";
import Card from "../components/generics/Card";
import CardInfoTopFive from "../components/generics/CardInfoTopFive";
import CarouselCard from "../components/generics/CarouselCard";

import { BsHouses } from "react-icons/bs";
import { IoPawSharp } from "react-icons/io5";

type Props = {};

function Layout({}: Props) {
  return (
    <>
      <Wrapper>
        <div className="w-full min-h-[50vh] grid grid-cols-3 place-items-center">
          <div className="w-40">
            <button className="btn-primary">Botón primario</button>
          </div>
          <div className="w-40">
            <button className="btn-secondary">Botón secundario</button>
          </div>
          <input type="text" className="input-primary" />
          <div className="w-40">
            <button className="btn-disabled">Hola amigos</button>
          </div>
          <div className="col-start-1 w-7/12 py-10">
            <Card
              image="https://imgs.search.brave.com/muR0HGm76B6gbdiwyaBULBApAqvAdlWv2aHFAsQYVUw/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJhY2Nlc3Mu/Y29tL2Z1bGwvNTA4/OTUyOC5qcGc"
              color="primary-orange"
              icon={<BsHouses color="white" size={30} />}
            >
              <CardInfoAssurence />
            </Card>
          </div>
          <div className=" w-7/12 py-10">
            <Card
              image="https://imgs.search.brave.com/muR0HGm76B6gbdiwyaBULBApAqvAdlWv2aHFAsQYVUw/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJhY2Nlc3Mu/Y29tL2Z1bGwvNTA4/OTUyOC5qcGc"
              color="primary-blue"
              icon={<IoPawSharp color="white" size={30} />}
            >
              <CardInfoTopFive />
            </Card>
          </div>
          <div className=" w-7/12 py-10"> 
            <CarouselCard/>  
          </div>
        </div>
      </Wrapper>
    </>
  );
}

export default Layout;
