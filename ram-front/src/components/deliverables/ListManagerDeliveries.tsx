// (c) Delta Software 2023, rights reserved.

import { Link } from "react-router-dom";
import { IDelivery } from "../../types";
import DeliveryCard from "../generics/cards/base/DeliveryCard";
import ManagerDelivery from "../generics/cards/info/ManagerDelivery";
import { useUrlFile } from "../../lib/files";

interface Props {
  deliveries: IDelivery[];
}
export function ManagerListGroupDeliveries({ deliveries }: Props) {
  const urlFile = useUrlFile();
  return (
    <>
      {deliveries.length ? (
        deliveries.map((delivery) => {
          const finalUrl = urlFile(delivery.imageUrl);
          return (
            <div className="pb-6" key={delivery.id}>
              <Link to={`/delivery/${delivery.id}`}>
                <DeliveryCard
                  color="blue"
                  nameDelivery={delivery.deliveryName}
                  image={finalUrl}
                >
                  <ManagerDelivery
                    membersNumber={delivery.userDeliveries?.length ?? 0}
                  />
                </DeliveryCard>
              </Link>
            </div>
          );
        })
      ) : (
        <div className="flex h-56 items-center justify-center text-xl">
          No hay entregas para este grupo
        </div>
      )}
    </>
  );
}
