// (c) Delta Software 2023, rights reserved.
import { Checkbox, Table } from "flowbite-react";
import { RxCross1 } from "react-icons/rx";
import { IUserName } from "../../types";

export interface IListSearchProps {
  agent: IUserName;
}

export const SearchAgentRow = ({ agent }: IListSearchProps) => {
  return (
    <>
      <Table.Row key={agent.id} className="border-2 border-gray-300">
        <Table.Cell>
          <Checkbox className="border-gray-400" />
        </Table.Cell>
        <Table.Cell>
          <img
            className="h-14 w-14 rounded-full"
            src={agent.imageURL}
            alt="Profile Image"
          />
        </Table.Cell>
        <Table.Cell>
          {agent.name} {agent.lastName}
        </Table.Cell>
        <Table.Cell>
          <RxCross1
            size={20}
            color="#A11A1A"
            className="cursor-pointer transition-all ease-in-out hover:scale-150"
          />
        </Table.Cell>
      </Table.Row>
    </>
  );
};
