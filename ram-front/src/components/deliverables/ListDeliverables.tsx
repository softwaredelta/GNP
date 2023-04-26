// (c) Delta Software 2023, rights reserved.
import DeliveryCard from "../generics/cards/DeliveryCard";
import { StatusDelivery } from "../generics/cards/DeliveryCard";

export interface IUserDeliverable {
  dateDelivery: string;
  deliveryId: string;
  deliveryName: string;
  description: string;
  fileUrl: string;
  groupName: string;
  imageUrl: string;
  status: StatusDelivery;
}

export interface IListDeliverables {
  deliverables: IUserDeliverable[];
}

export default function ListDeliverables({ deliverables }: IListDeliverables) {
  if (deliverables.length === 0) return <h1>No hay entregables</h1>;

  return (
    <div className="grid grid-cols-1 gap-10 p-12 w-10/12 mx-auto">
      {deliverables.map((elem, index) => {
        return (
          <DeliveryCard
            key={index}
            nameDelivery={elem.deliveryName}
            image={elem.imageUrl}
            color={index % 2 ? "orange" : "blue"}
            status={elem.status}
          />
        );
      })}
    </div>
  );
}
