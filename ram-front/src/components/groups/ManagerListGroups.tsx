// (c) Delta Software 2023, rights reserved.
import { Link } from "react-router-dom";
import Card from "../generics/cards/base/Card";
import CardInfoNumMembers from "../generics/cards/info/CardInfoNumMembers";
import { IGroup } from "../../types";

interface Props {
  groups: IGroup[];
}

export function ManagerListGroups({ groups }: Props) {
  return (
    <>
      {groups.length > 0 ? (
        groups.map((group) => (
          <div className=" p-10" key={group.id}>
            <Link to={`/group/${group.id}`}>
              <Card color="blue" image={group.imageURL}>
                <CardInfoNumMembers
                  color="blue"
                  nameGroup={group.name}
                  number={group.groupUsers?.length ?? 0}
                />
              </Card>
            </Link>
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