// (c) Delta Software 2023, rights reserved.
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
        <div className="flex h-56 items-center justify-center text-xl">
          No hay grupos registrados
        </div>
      )}
    </>
  );
}
