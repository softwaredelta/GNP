// (c) Delta Software 2023, rights reserved.

import { IUserDelivery } from "../../types";

import DeliveryCard from "../generics/cards/DeliveryCard";

import { useNavigate } from "react-router-dom";

interface Props {
  deliverables: IUserDelivery[];
}

export default function ListDeliverables({ deliverables }: Props) {
  const navigate = useNavigate();

  if (deliverables.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-700">
          No hay entregables
        </h1>
        <p className="text-center text-lg text-gray-500">
          No hay entregables registrados en este momento.
          <br />
          Por favor, inténtelo de nuevo más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-10/12 grid-cols-1 gap-10 p-12">
      {deliverables.map((elem, index) => {
        if (!elem.delivery) {
          throw new Error("No se encontró la entrega");
        }

        return (
          <>
            <div
              onClick={() => navigate(`/group-delivery/${elem.deliveryId}`)}
              className="cursor-pointer pt-1 transition-all ease-in-out hover:scale-105"
            >
              <DeliveryCard
                key={index}
                deliveryId={elem.deliveryId}
                nameDelivery={elem.delivery.deliveryName}
                hasDelivery={elem.delivery.hasDelivery}
                image={elem.delivery.imageUrl}
                color={index % 2 ? "orange" : "blue"}
                status={elem.status}
                fileUrl={elem.fileUrl}
              />
            </div>
          </>
        );
      })}
    </div>
  );
}
