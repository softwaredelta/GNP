// (c) Delta Software 2023, rights reserved.
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
      {groups.map((group, index) => (
        <div className="w-11/12 lg:w-10/12" key={group.id} role="group">
          <button
            className="w-full hover:scale-105 transition-all ease-in-out active:scale-95 cursor-pointer"
            onClick={() => {
              alert("Redireccionando al grupo ...");
            }}
          >
            <Card color={index % 2 ? "orange" : "blue"} image={group.image}>
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
