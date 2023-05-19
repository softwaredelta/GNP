// (c) Delta Software 2023, rights reserved.
import { useNavigate } from "react-router-dom";
import Card from "../generics/cards/base/Card";
import CardInfoGroup from "../generics/cards/info/CardInfoGroup";
import { IGroup } from "../../types";
import { useUrlFile } from "../../lib/files";

export interface IListGroupProps {
  groups: IGroup[];
}

export default function ListGroup({ groups }: IListGroupProps): JSX.Element {
  const fileUrl = useUrlFile();
  const navigate = useNavigate();
  if (groups.length === 0) return <h1>No hay grupos</h1>;

  return (
    <>
      {groups.map((group, index) => (
        <div className="w-11/12 lg:w-10/12" key={group.id} role="group">
          <button
            className="w-full cursor-pointer transition-all ease-in-out hover:scale-105 active:scale-95"
            onClick={() => {
              navigate(`/group/${group.id}`);
            }}
          >
            <Card
              color={index % 2 ? "orange" : "blue"}
              image={fileUrl(group.imageURL as string)}
            >
              <CardInfoGroup
                color={index % 2 ? "orange" : "blue"}
                nameGroup={group.name}
                progress={group.progress as number}
              />
            </Card>
          </button>
        </div>
      ))}
    </>
  );
}
