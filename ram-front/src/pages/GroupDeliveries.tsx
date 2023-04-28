// (c) Delta Software 2023, rights reserved.

import { useParams } from "react-router-dom";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import ListManagerDeliveries from "../components/deliverables/ListManagerDeliveries";

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
    url: `groups/${id}`,
    method: "GET",
  });

  return (
    <div>
      <Wrapper>
        <>
          <p className="title">{response?.name}</p>
          <div className="w-full flex justify-center min-h-[26%] gap-10">
            <div className="w-3/5">
              {response && (
                <ListManagerDeliveries
                  groupDeliveries={response.groupDeliveries}
                />
              )}
            </div>
          </div>
        </>
      </Wrapper>
    </div>
  );
}
