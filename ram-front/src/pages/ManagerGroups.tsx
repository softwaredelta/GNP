// (c) Delta Software 2023, rights reserved.

import Wrapper from "../containers/Wrapper";
import { useRecoilValue } from "recoil";
import { allCourses$ } from "../lib/api/api-courses";
import { ManagerListGroups } from "../components/groups/ManagerListGroups";

// Manager view that list all groups
export default function ManagerCourses() {
  const groups = useRecoilValue(allCourses$);

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
            <ManagerListGroups groups={groups}></ManagerListGroups>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
