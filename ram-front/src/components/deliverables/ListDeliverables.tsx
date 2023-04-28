// (c) Delta Software 2023, rights reserved.
import { IUserDelivery } from "../../types";
import DeliveryCard from "../generics/cards/DeliveryCard";

interface Props {
  deliverables: IUserDelivery[];
}

export default function ListDeliverables({ deliverables }: Props) {
  if (deliverables.length === 0) return <h1>No hay entregables</h1>;

  return (
    <div className="grid grid-cols-1 gap-10 p-12 w-10/12 mx-auto">
      {deliverables.map((elem, index) => {
        if (!elem.delivery) {
          throw new Error("No se encontró la entrega");
        }

        return (
          <DeliveryCard
            key={index}
            nameDelivery={elem.delivery.deliveryName}
            image={elem.delivery.imageURL}
            color={index % 2 ? "orange" : "blue"}
            status={elem.status}
          />
        );
      })}
    </div>
  );
}
