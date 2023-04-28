// (c) Delta Software 2023, rights reserved.

import { Link } from "react-router-dom";
import { IDelivery } from "../../types";
import DeliveryCard from "../generics/cards/base/DeliveryCard";
import ManagerDelivery from "../generics/cards/info/ManagerDelivery";

interface Props {
  deliveries: IDelivery[];
}

export function ManagerListGroupDeliveries({ deliveries }: Props) {
  return (
    <>
      {deliveries.length ? (
        deliveries.map((delivery) => (
          <div className="pb-6" key={delivery.id}>
            <Link to={`/delivery/${delivery.id}`}>
              <DeliveryCard
                color="blue"
                nameDelivery={delivery.description}
                image={delivery.imageURL}
              >
                <ManagerDelivery
                  membersNumber={delivery.userDeliveries?.length ?? 0}
                />
              </DeliveryCard>
            </Link>
          </div>
        ))
      ) : (
        <div className="h-56 text-xl flex items-center justify-center">
          No hay entregas para este grupo
        </div>
      )}
    </>
  );
}
