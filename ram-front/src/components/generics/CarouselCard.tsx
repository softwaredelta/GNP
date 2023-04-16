// (c) Delta Software 2023, rights reserved.

import { Carousel } from "flowbite-react";
import CardInfoTopFive from "./cards/info/CardInfoTopFive";
import Card from "./cards/base/Card";

import { IoPawSharp } from "react-icons/io5";

const CarouselCard = () => {
  return (
    <div className="h-full">
      <Carousel>
        <Card
          image="https://imgs.search.brave.com/muR0HGm76B6gbdiwyaBULBApAqvAdlWv2aHFAsQYVUw/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJhY2Nlc3Mu/Y29tL2Z1bGwvNTA4/OTUyOC5qcGc"
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
            ]}
          />
        </Card>
        <Card
          image="https://imgs.search.brave.com/muR0HGm76B6gbdiwyaBULBApAqvAdlWv2aHFAsQYVUw/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJhY2Nlc3Mu/Y29tL2Z1bGwvNTA4/OTUyOC5qcGc"
          color="primary-orange"
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
            ]}
          />
        </Card>
        <Card
          image="https://imgs.search.brave.com/muR0HGm76B6gbdiwyaBULBApAqvAdlWv2aHFAsQYVUw/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJhY2Nlc3Mu/Y29tL2Z1bGwvNTA4/OTUyOC5qcGc"
          color="light-orange"
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
            ]}
          />
        </Card>
      </Carousel>
    </div>
  );
};

export default CarouselCard;
