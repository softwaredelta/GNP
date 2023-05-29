// (c) Delta Software 2023, rights reserved.

import { Table } from "flowbite-react";
import { useState } from "react";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { BsFillCheckSquareFill } from "react-icons/bs";

interface LinkRowProps {
  id: string;
  name: string;
  link: string;
  onDeleted?: (id: string) => void;
  onEdited?: (id: string, name: string, link: string) => void;
  isEdit?: boolean;
}

export default function LinkRow({
  id,
  name,
  link,
  onDeleted,
  onEdited,
  isEdit = true,
}: LinkRowProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [urlLink, setLink] = useState<string>(link);
  const [nameLink, setName] = useState<string>(name);

  return (
    <Table.Row
      key={id}
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      {edit && isEdit ? (
        <>
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            <div className="mb-2">
              <input
                className="input-primary-table overflow-hidden"
                defaultValue={nameLink}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <input
                className="input-primary-table overflow-hidden"
                defaultValue={urlLink}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
          </Table.Cell>

          <Table.Cell>
            <div className="flex items-center justify-center ">
              <div className="cursor-pointer transition-all ease-in-out hover:scale-125 active:scale-95">
                <BsFillCheckSquareFill
                  size={20}
                  className="text-green-500"
                  onClick={() => {
                    if (onEdited) onEdited(id, nameLink, urlLink);
                    setEdit(false);
                  }}
                />
              </div>
            </div>
          </Table.Cell>
        </>
      ) : isEdit && !edit ? (
        <>
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            <a
              href={urlLink}
              className="overflow-hidden hover:text-sky-500 hover:underline"
            >
              {nameLink}
            </a>
          </Table.Cell>

          <Table.Cell>
            <div className="grid grid-cols-2 items-center justify-center ">
              <div className="cursor-pointer transition-all ease-in-out hover:scale-125 active:scale-95">
                <FiEdit
                  size={20}
                  className="text-green-500"
                  onClick={() => setEdit(true)}
                />
              </div>
              <div className="cursor-pointer transition-all ease-in-out hover:scale-125 active:scale-95">
                <FiTrash2
                  size={20}
                  className="text-red-500"
                  onClick={() => {
                    if (onDeleted) onDeleted(id);
                  }}
                />
              </div>
            </div>
          </Table.Cell>
        </>
      ) : (
        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
          <a
            href={urlLink}
            className="overflow-hidden hover:text-sky-500 hover:underline"
          >
            {nameLink}
          </a>
        </Table.Cell>
      )}
    </Table.Row>
  );
}
