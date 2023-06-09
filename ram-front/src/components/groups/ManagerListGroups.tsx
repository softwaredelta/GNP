// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=2144727033
// * M1_S04
import { useNavigate } from "react-router-dom";
import { useUrlFile } from "../../lib/files";
import { IGroup } from "../../types";
import Card from "../generics/cards/base/Card";
import CardInfoNumMembers from "../generics/cards/info/CardInfoNumMembers";

interface Props {
  groups: IGroup[];
}

export function ManagerListGroups({ groups }: Props) {
  const fileUrl = useUrlFile();
  const navigate = useNavigate();

  return (
    <>
      {groups.length > 0 ? (
        groups.map((group) => (
          <div className=" p-10" key={group.id}>
            <div onClick={() => navigate(`/group/${group.id}`)}>
              <Card color="blue" image={fileUrl(group.imageUrl as string)}>
                <CardInfoNumMembers
                  color="blue"
                  nameGroup={group.name}
                  number={group.groupUsers?.length ?? 0}
                  groupId={group.id as string}
                />
              </Card>
            </div>
          </div>
        ))
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-700">
            No hay grupos
          </h1>
          <p className="text-center text-lg text-gray-500">
            No estás registrado en ningún grupo en este momento.
            <br />
            Por favor, inténtelo de nuevo más tarde.
          </p>
        </div>
      )}
    </>
  );
}
