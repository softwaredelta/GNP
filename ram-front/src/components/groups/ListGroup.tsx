export interface IListGroupProps {
  groups: {
    id: string;
    name: string;
    progress: number;
  }[];
}

export default function ListGroup({ groups }: IListGroupProps): JSX.Element {
  return <div className="list-group"></div>;
}
