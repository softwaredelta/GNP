// (c) Delta Software 2023, rights reserved.
import "@testing-library/jest-dom";
import Card from "../generics/cards/base/Card";
import CardInfoGroup from "../generics/cards/info/CardInfoGroup";

export interface IListGroupProps {
  groups: {
    id: string;
    name: string;
    progress: number;
    image: string;
  }[];
}

export default function ListGroup({ groups }: IListGroupProps): JSX.Element {
  if (groups.length === 0) return <h1>No hay grupos</h1>;

  return (
    <>
      {groups.map((group) => (
        <div className="w-7/12" key={group.id} role="group">
          <button
            className="w-full hover:scale-105 transition-all ease-in-out active:scale-95 cursor-pointer"
            onClick={() => {
              alert("Redireccionando al grupo ...");
            }}
          >
            <Card color="blue" image={group.image}>
              <CardInfoGroup
                color="blue"
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
