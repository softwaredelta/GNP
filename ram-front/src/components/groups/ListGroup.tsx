// (c) Delta Software 2023, rights reserved.
import { useNavigate } from "react-router-dom";
import Card from "../generics/cards/base/Card";
import CardInfoGroup from "../generics/cards/info/CardInfoGroup";
import { IGroup } from "../../types";

export interface IListGroupProps {
  groups: IGroup[];
}

export default function ListGroup({ groups }: IListGroupProps): JSX.Element {
  const navigate = useNavigate();
  if (groups.length === 0) return <h1>No hay grupos</h1>;

  return (
    <>
      {groups.map((group, index) => (
        <div className="w-11/12 lg:w-10/12" key={group.id} role="group">
          <button
            className="w-full hover:scale-105 transition-all ease-in-out active:scale-95 cursor-pointer"
            onClick={() => {
              navigate(`/group/${group.id}`);
            }}
          >
            <Card color={index % 2 ? "orange" : "blue"} image={group.imageURL}>
              <CardInfoGroup
                color={index % 2 ? "orange" : "blue"}
                nameGroup={group.name}
                progress={group.progress}
              />
            </Card>
          </button>
        </div>
      ))}
    </>
  );
}
