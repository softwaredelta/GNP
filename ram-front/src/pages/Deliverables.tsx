// (c) Delta Software 2023, rights reserved.
import ListDeliverables from "../components/deliverables/ListDeliverables";
import Wrapper from "../containers/Wrapper";

export default function Deliverables(): JSX.Element {
  const exampleGroupName = "Grupo 1";
  const exampleDeliverables = [
    {
      nameDelivery: "Entregable 1",
      image:
        "https://i.blogs.es/799a0e/ydray-mew_27_articuno_45l_hyperx_environment_front/1366_2000.jpeg",
        color: "blue",
        status: "Entregado"
    },
    {
      nameDelivery: "Entregable 2",
      image:
        "https://i.blogs.es/799a0e/ydray-mew_27_articuno_45l_hyperx_environment_front/1366_2000.jpeg",
        color: "orange",
        status: "Rechazado"
    },
  ];

  return (
    <Wrapper>
      <div>
        <div className="w-full flex items-center justify-start py-8">
          <h1 className=" font-bold py-3 px-20 bg-gnp-orange-500 text-white text-xl rounded-r-2xl">
            {exampleGroupName}
          </h1>
        </div>
        <ListDeliverables deliverables={exampleDeliverables} />
      </div>
    </Wrapper>
  );
}
