// (c) Delta Software 2023, rights reserved.

import { useParams } from "react-router-dom";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { ManagerListGroupDeliveries } from "../components/deliverables/ListManagerDeliveries";
import { IGroup } from "../types";

export default function GroupDeliveries() {
  const { id } = useParams();

  const { response: group } = useAxios<IGroup>({
    url: `groups/${id}`,
    method: "GET",
  });

  return (
    <div>
      <Wrapper>
        <>
          <p className="title">{group?.name}</p>
          <div className="w-full flex justify-center min-h-[26%] gap-10">
            <div className="w-3/5">
              {group && (
                <ManagerListGroupDeliveries
                  deliveries={group.deliveries ?? []}
                />
              )}
            </div>
          </div>
        </>
      </Wrapper>
    </div>
  );
}
