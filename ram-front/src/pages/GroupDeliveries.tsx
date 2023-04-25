// (c) Delta Software 2023, rights reserved.

import { useParams } from "react-router-dom";
import DeliveryCard from "../components/generics/cards/base/DeliveryCard";
import ManagerDelivery from "../components/generics/cards/info/ManagerDelivery";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";

export default function GroupDeliveries() {
  const { id } = useParams();

  const { response } = useAxios<{
    id: string;
    name: string;
    groupDeliveries: {
      id: string;
      description: string;
      imageUrl: string;
      groupId: string;
      userDeliveries: {
        id: string;
        description: string;
        imageURL: string;
      }[];
    }[];
  }>({
    url: `group/${id}`,
    method: "GET",
  });

  return (
    <div>
      <Wrapper>
        <>
          <p className="title">{response?.name}</p>
          <div className="w-full flex justify-center min-h-[26%] gap-10">
            <div className="w-3/5">
              {response ? (
                response?.groupDeliveries.map((groupsObj, index) => (
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
            </div>
          </div>
        </>
      </Wrapper>
    </div>
  );
}
