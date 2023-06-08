// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1855489237
// * M1_S02
import { useParams } from "react-router-dom";
import ListDeliverables from "../components/deliverables/ListDeliverables";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { IGroup, IUserDelivery } from "../types";

export default function Group(): JSX.Element {
  const { id: idGroup } = useParams();

  const { response: deliveriesList, loading: loadingDeliveries } = useAxios<
    IUserDelivery[]
  >({
    url: `deliveries/my-deliveries/${idGroup}`,
    method: "GET",
  });
  const { response: group } = useAxios<IGroup>({
    url: `groups/${idGroup}`,
    method: "GET",
  });

  if (loadingDeliveries) return <h1>Loading...</h1>;

  return (
    <Wrapper title={group?.name as string}>
      <div>
        {deliveriesList ? (
          <>
            <ListDeliverables deliverables={deliveriesList} />
          </>
        ) : (
          <></>
        )}
      </div>
    </Wrapper>
  );
}
