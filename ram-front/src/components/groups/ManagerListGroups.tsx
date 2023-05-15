// (c) Delta Software 2023, rights reserved.
import { useNavigate } from "react-router-dom";
import Card from "../generics/cards/base/Card";
import CardInfoNumMembers from "../generics/cards/info/CardInfoNumMembers";
import { IGroup } from "../../types";
import { useState, useEffect } from "react";

interface Props {
  groups: IGroup[];
  onDeleted: () => void;
}

export function ManagerListGroups({ groups, onDeleted }: Props) {
  const navigate = useNavigate();

  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  useEffect(() => {
    if (shouldUpdate) {
      onDeleted();
      setShouldUpdate(false);
    }
  }, [onDeleted, shouldUpdate]);

  return (
    <>
      {groups.length > 0 ? (
        groups.map((group) => (
          <div className=" p-10" key={group.id}>
            <div onClick={() => navigate(`/group/${group.id}`)}>
              <Card color="blue" image={group.imageURL}>
                <CardInfoNumMembers
                  color="blue"
                  nameGroup={group.name}
                  number={group.groupUsers?.length ?? 0}
                  groupId={group.id}
                  onDeleted={() => setShouldUpdate(true)}
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
