// (c) Delta Software 2023, rights reserved.

// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=957708639
// * M1_S01
import { useNavigate } from "react-router-dom";
import { useUrlFile } from "../../lib/files";
import { IGroup } from "../../types";
import Card from "../generics/cards/base/Card";
import CardInfoGroup from "../generics/cards/info/CardInfoGroup";

export interface IListGroupProps {
  groups: IGroup[];
}

export default function ListGroup({ groups }: IListGroupProps): JSX.Element {
  const fileUrl = useUrlFile();
  const navigate = useNavigate();
  if (groups.length === 0)
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-700">No hay grupos</h1>
        <p className="text-center text-lg text-gray-500">
          No estás registrado en ningún grupo en este momento.
          <br />
          Por favor, inténtelo de nuevo más tarde.
        </p>
      </div>
    );

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
              image={fileUrl(group.imageUrl as string)}
            >
              <CardInfoGroup
                color={index % 2 ? "orange" : "blue"}
                nameGroup={group.name}
                progress={(group.progress as number) || 0}
              />
            </Card>
          </button>
        </div>
      ))}
    </>
  );
}
