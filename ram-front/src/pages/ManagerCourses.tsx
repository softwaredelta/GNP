// (c) Delta Software 2023, rights reserved.

import Card from "../components/generics/cards/base/Card";
import CardInfoNumMembers from "../components/generics/cards/info/CardInfoNumMembers";
import Wrapper from "../containers/Wrapper";
import { useRecoilValue } from "recoil";
import { allCourses$ } from "../lib/api/api-courses";

export interface IManagerCoursesProps {
  name: string;
  members: number;
  color: "blue" | "orange";
}

export function ManagerCourses() {
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
            {groups &&
              groups.length > 0 &&
              groups.map((groupsObj, index) => (
                <div className=" p-10" key={index}>
                  <button
                    className="hover:scale-105 transition-all ease-in-out active:scale-95 cursor-pointer"
                    onClick={() => alert("Redireccionando al grupo ...")}
                  >
                    <Card
                      color="blue"
                      image="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg"
                    >
                      <CardInfoNumMembers
                        color="blue"
                        nameGroup={groupsObj.name}
                        number={groupsObj.groupUsers.length}
                      />
                    </Card>
                  </button>
                </div>
              ))}{" "}
            : (<div>No hay grupos </div>)
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
