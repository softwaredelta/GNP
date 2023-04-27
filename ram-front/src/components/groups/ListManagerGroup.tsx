// (c) Delta Software 2023, rights reserved.
import { useNavigate } from "react-router-dom";
import Card from "../generics/cards/base/Card";
import CardInfoGroup from "../generics/cards/info/CardInfoGroup";
import CardInfoNumMembers from "../generics/cards/info/CardInfoNumMembers";

export interface IListManagerGroupProps {
  groups: IGroup[];
}

export interface IGroup {
  id: string;
  name: string;
  imageURL: string;
  groupUsers: [
    {
      status: "active";
      userId: "test-user";
      groupId: "1";
    },
  ];
}

export default function ListManagerGroup({
  groups,
}: IListManagerGroupProps): JSX.Element {
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
    <>
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
    </>
  );
}
