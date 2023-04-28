// (c) Delta Software 2023, rights reserved.

import DeliveryCard from "../generics/cards/base/DeliveryCard";
import ManagerDelivery from "../generics/cards/info/ManagerDelivery";

export interface IUserDeliveriesProps {
  id: string;
  description: string;
  imageURL: string;
}

export interface IGroupDeliveriesProps {
  id: string;
  description: string;
  imageUrl: string;
  groupId: string;
  userDeliveries: IUserDeliveriesProps[];
}

export interface IManagerDeliveriesProps {
  groupDeliveries: IGroupDeliveriesProps[];
}

export default function ListManagerDeliveries({
  groupDeliveries,
}: IManagerDeliveriesProps) {
  return (
    <>
      {groupDeliveries.length ? (
        groupDeliveries.map((groupsObj, index) => (
          <div className="pb-6" key={index}>
            <DeliveryCard
              color="blue"
              nameDelivery={groupsObj.description}
              image={groupsObj.imageUrl}
            >
              <ManagerDelivery
                membersNumber={groupsObj.userDeliveries.length}
              ></ManagerDelivery>
            </DeliveryCard>
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
