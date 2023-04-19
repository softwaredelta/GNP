// (c) Delta Software 2023, rights reserved.

import DeliveryCard from "./generics/cards/DeliveryCard";

function Delivery() {
  return (
    <>
      <div className="w-full min-h-[50vh] grid md:grid-cols-3 place-items-center gap-10 py-20">
        <div className="md:col-span-3 ">
          <DeliveryCard
            color="blue"
            nameDelivery="Nombre de la entrega"
            status="Sin enviar"
            image="https://i.blogs.es/799a0e/ydray-mew_27_articuno_45l_hyperx_environment_front/1366_2000.jpeg"
          />
        </div>
      </div>
    </>
  );
}

export default Delivery;
