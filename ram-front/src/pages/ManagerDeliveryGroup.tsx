// (c) Delta Software 2023, rights reserved.
import Wrapper from "../containers/Wrapper";
import { useParams } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { IDeliveryDescription } from "../types";
import EditDeliveryForm from "../components/forms/EditDeliveryForm";

export default function ManagerDeliveryGroup(): JSX.Element {
  const { id } = useParams();

  const { response: delivery } = useAxios<IDeliveryDescription>({
    url: `deliveries/group-delivery/${id}`,
    method: "GET",
  });

  return (
    <Wrapper title={"Editando entregable: " + delivery?.deliveryName || ""}>
      <div className="w-full rounded-3xl px-10">
        {delivery && id && <EditDeliveryForm delivery={delivery} id={id} />}
      </div>
    </Wrapper>
  );
}
