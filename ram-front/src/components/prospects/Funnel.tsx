import React, { useState, ChangeEvent, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { RiFileExcel2Fill } from "react-icons/ri";
import useAxios from "../../hooks/useAxios";
import { IUser } from "../../types";

// const INITIAL_STATE = [
//   {
//     id: 1,
//     nombreAgente: "Alex Martinez",
//     nProspectosC: 50,

//   },
//   {
//     id: 2,
//     nombreAgente: "Ricardo Nuñez",
//     nProspectosC: 60,
//   },
//   {
//     id: 3,
//     nombreAgente: "Angel Rico",
//     nProspectosC: 78,
//   },
//   {
//     id: 4,
//     nombreAgente: "Monica Ayala",
//     nProspectosC: 55,
//   },
//   {
//     id: 5,
//     nombreAgente: "Eric Alfredo",
//     nProspectosC: 90,
//   }
// ]

// interface Prosp{
//   id: number;
//   nombreAgente: string;
//   nProspectosC: number;
// }
const FunnelProspects= () => {

  const { response: agents } = useAxios<IUser[]>({
    url: `users/all`,
    method: "GET",
  });
  const handleClick = () => {
    console.log(agents);
  };

  return (
    <div>
      <div className="mt-8 flex flex-col items-center justify-center">
      <div data-testid="sales-table" className="grid-row grid w-full px-8 pb-4">
          <Table className="row" hoverable={true}>
            <Table.Head>
              <Table.HeadCell align="center">Nombre de agente</Table.HeadCell>
              <Table.HeadCell align="center">Prospectos calificados</Table.HeadCell>
              <Table.HeadCell align="center">Citas agendadas</Table.HeadCell>
              <Table.HeadCell align="center">Citas efectivas</Table.HeadCell>
              <Table.HeadCell align="center">Solicitudes de vida</Table.HeadCell>
              <Table.HeadCell align="center">Poliza pagada</Table.HeadCell>
              <Table.HeadCell align="center">PP200</Table.HeadCell>
            </Table.Head>
            {/* <Table.Body className="divide-y">
              {agents?.map((agent: any) => {
                return (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" align="center">
                      {agent.user.email}
                    </Table.Cell>
                    <Table.Cell align="center">{agent.nProspectosC}</Table.Cell>
                    <Table.Cell align="center">{(agent.nProspectosC*0.48).toFixed(0)}</Table.Cell>
                    <Table.Cell align="center">{(agent.nProspectosC*0.40).toFixed(0)}</Table.Cell>
                    <Table.Cell align="center">{(agent.nProspectosC*0.08).toFixed(0)}</Table.Cell>
                    <Table.Cell align="center">{(agent.nProspectosC*0.04).toFixed(0)}</Table.Cell>
                    <Table.Cell align="center">
                      <RiFileExcel2Fill
                        className=" hover:scale-105 hover:fill-green-500"
                      />
                    </Table.Cell>
                  </Table.Row>
                ); 
              })}
            </Table.Body> */}
          </Table>
          <button onClick={handleClick}> Hola</button>
    </div>
      </div>
    </div>  
  );
}

export default FunnelProspects;