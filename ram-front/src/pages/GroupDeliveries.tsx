// (c) Delta Software 2023, rights reserved.

import DeliveryCard from "../components/generics/cards/base/DeliveryCard";
import ManagerDelivery from "../components/generics/cards/info/ManagerDelivery";
import Wrapper from "../containers/Wrapper";
import { allCourses$ } from "../lib/api/api-courses";
import { useRecoilValue } from "recoil";

export default function GroupDeliveries() {
  const groups = useRecoilValue(allCourses$);

  return (
    <div>
      <Wrapper>
        <>
          <p className="title">Nombre del curso</p>
          <div className="w-full flex justify-center min-h-[26%] gap-10">
            <div className="w-3/5">
              <div className="pb-6">
                <DeliveryCard
                  color="blue"
                  nameDelivery="Nombre de la entrega"
                  image="https://i.blogs.es/799a0e/ydray-mew_27_articuno_45l_hyperx_environment_front/1366_2000.jpeg"
                >
                  <ManagerDelivery membersNumber={30}></ManagerDelivery>
                </DeliveryCard>
              </div>
            </div>
          </div>
        </>
      </Wrapper>
    </div>
  );
}
