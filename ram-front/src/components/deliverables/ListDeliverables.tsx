// (c) Delta Software 2023, rights reserved.
import DeliveryCard, {
  DeliveryCardProps,
} from "../generics/cards/DeliveryCard";

export interface IListDeliverables {
  deliverables: DeliveryCardProps[];
}

export default function ListDeliverables({ deliverables }: IListDeliverables) {
  return (
    <div className=" w-full grid grid-cols-2 gap-10 p-12">
      {deliverables.map((elem, index) => {
        return (
          <DeliveryCard
            key={index}
            nameDelivery={elem.nameDelivery}
            image={elem.image}
            color={elem.color}
            status={elem.status}
          />
        );
      })}
    </div>
  );
}
