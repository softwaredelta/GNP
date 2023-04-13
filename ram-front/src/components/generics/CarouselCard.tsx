// (c) Delta Software 2023, rights reserved.

import React from "react";
import { Carousel, Button } from "flowbite-react";
import CardInfoTopFive from "./CardInfoTopFive";
import Card from "./Card";

import { IoPawSharp } from "react-icons/io5";

type Props = {};

const CarouselCard = (props: Props) => {
  return (
    <div className="h-full">
      <Carousel>
        <Card
          image="https://imgs.search.brave.com/muR0HGm76B6gbdiwyaBULBApAqvAdlWv2aHFAsQYVUw/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJhY2Nlc3Mu/Y29tL2Z1bGwvNTA4/OTUyOC5qcGc"
          color="primary-blue"
          icon={<IoPawSharp color="white" size={30} />}
        >
          <CardInfoTopFive />
        </Card>
        <Card
          image="https://imgs.search.brave.com/muR0HGm76B6gbdiwyaBULBApAqvAdlWv2aHFAsQYVUw/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJhY2Nlc3Mu/Y29tL2Z1bGwvNTA4/OTUyOC5qcGc"
          color="primary-orange"
          icon={<IoPawSharp color="white" size={30} />}
        >
          <CardInfoTopFive />
        </Card>
        <Card
          image="https://imgs.search.brave.com/muR0HGm76B6gbdiwyaBULBApAqvAdlWv2aHFAsQYVUw/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJhY2Nlc3Mu/Y29tL2Z1bGwvNTA4/OTUyOC5qcGc"
          color="light-orange"
          icon={<IoPawSharp color="white" size={30} />}
        >
          <CardInfoTopFive />
        </Card>
      </Carousel>
    </div>
  );
};

export default CarouselCard;
