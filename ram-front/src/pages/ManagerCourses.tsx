// (c) Delta Software 2023, rights reserved.

import Card from "../components/generics/cards/base/Card";
import CardInfoNumMembers from "../components/generics/cards/info/CardInfoNumMembers";
import Wrapper from "../containers/Wrapper";
import { useRecoilValue } from "recoil";
import { allCourses$ } from "../lib/api/api-courses";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ManagerCourses() {
  const groups = useRecoilValue(allCourses$);
  const navigate = useNavigate();

  const clickHandler = async (event: any, courseId: string) => {
    event.preventDefault();
    try {
      await onclick;
      navigate(`/groupDeliveries/${courseId}`);
    } catch (error) {
      navigate("/managerCourses");
    }
  };

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
            {groups.length > 0 ? (
              groups.map((groupsObj, index) => (
                <div className=" p-10" key={index}>
                  <button
                    className="hover:scale-105 transition-all ease-in-out active:scale-95 cursor-pointer"
                    onClick={(event) => clickHandler(event, groupsObj.id)}
                  >
                    <Card color="blue" image={groupsObj.imageURL}>
                      <CardInfoNumMembers
                        color="blue"
                        nameGroup={groupsObj.name}
                        number={groupsObj.groupUsers.length}
                      />
                    </Card>
                  </button>
                </div>
              ))
            ) : (
              <div className="h-56 text-xl flex items-center justify-center">
                No hay grupos registrados
              </div>
            )}
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
