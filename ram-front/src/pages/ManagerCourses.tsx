// (c) Delta Software 2023, rights reserved.

import Wrapper from "../containers/Wrapper";
import { useRecoilValue } from "recoil";
import { allCourses$ } from "../lib/api/api-courses";
import ListManagerGroup from "../components/groups/ListManagerGroup";

export default function ManagerCourses() {
  const data = useRecoilValue(allCourses$);

  return (
    <div>
      <Wrapper>
        <div>
          <div className="w-full flex justify-end px-20 pt-10">
            <div className="w-1/12 font-bold rounded-3xl overflow-hidden">
              <button className="btn-primary">Agregar</button>
            </div>
          </div>
          <div className="grid md:grid-cols-4 place-items-center">
            <ListManagerGroup groups={data.groups}></ListManagerGroup>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
