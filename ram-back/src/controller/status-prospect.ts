// (c) Delta Software 2023, rights reserved.
import { Router } from "express";
import { getProspectStatus } from "../app/satus-prospect";
import { getDataSource } from "../arch/db-client";
import { ProspectStatusEnt } from "../entities/prospect-status.entity";
import { authMiddleware } from "./user";

export const statusProspectRouter = Router();

/* This code defines a route for the `statusProspectRouter` object using the HTTP GET method and a URL
parameter `:id`. The `authMiddleware()` function is used as middleware to authenticate the user
before accessing the route. When a request is made to this route, the `getProspectStatus()` function
is called with the `prospectId` parameter extracted from the URL. If the function call is
successful, the response is sent with a status code of 201 and the `prospectStatus` object as JSON.
If there is an error, the response is sent with a status code of 400 and a JSON object with a
`message` property set to "BAD_DATA". 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=998764442
// * M5_S07

*/
statusProspectRouter.get("/:id", authMiddleware(), async (req, res) => {
  const prospectId = req.params.id;
  try {
    const prospectStatus = await getProspectStatus({ prospectId });
    res.status(201).json(prospectStatus);
  } catch (e) {
    res.status(400).json({ message: "BAD_DATA" });
  }
});

/* This code defines a route for the `statusProspectRouter` object using the HTTP GET method and a URL
parameter `:AgentId`. When a request is made to this route, it retrieves the prospect status counts
for each status type for the given agent ID. It does this by querying the database using the
`getDataSource()` function to get a connection to the database, and then using the
`ProspectStatusEnt` entity to retrieve the prospect status counts. The counts are grouped by status
ID and formatted into an object with the status name and count. Finally, the counts are accumulated
into an object with the total count for each status type, and the response is sent with a status
code of 200 and the accumulated counts as JSON. If there is an error, the response is sent with a
status code of 400 and a JSON object with a `message` property set to "BAD_DATA" and a `reason`
property with the error message. */

// statusProspectRouter.get("/status-by-agents/:AgentId", async (req, res) => {
//   const AgentId = req.params.AgentId;
//   try {
//     const dataSource = await getDataSource();
//     const prospectStatusRepository =
//       dataSource.getRepository(ProspectStatusEnt);

// statusProspectRouter.get("/status-by-agents/:AgentId", async (req, res) => {
//   const AgentId = req.params.AgentId;
//   try {
//     const dataSource = await getDataSource();
//     const prospectStatusRepository =
//       dataSource.getRepository(ProspectStatusEnt);

//     const prospectStatusCounts = await prospectStatusRepository
//       .createQueryBuilder("prospectStatus")
//       .select("prospectStatus.statusId", "statusId")
//       .addSelect("status.statusName", "statusName")
//       .addSelect("COUNT(*)", "count")
//       .innerJoin("prospectStatus.prospect", "prospect")
//       .innerJoin("prospectStatus.status", "status")
//       .where("prospect.userId = :AgentId", { AgentId })
//       .groupBy("status.statusName") // Agrupar por el nombre del estado
//       .getRawMany();

//     const accumulatedCounts: { [key: string]: number } = {
//       "Nuevo prospecto": 0,
//       "Cita agendada": 0,
//       "Cita efectiva": 0,
//       "Solicitud de seguro": 0,
//       "Poliza pagada": 0,
//       Retirado: 0,
//     };

//     prospectStatusCounts.forEach((count: any) => {
//       const { statusName, count: statusCount } = count;
//       accumulatedCounts[statusName] += statusCount;
//     });

//     res.status(200).json(accumulatedCounts);
//   } catch (e) {
//     res.status(400).json({ message: "BAD_DATA", reason: e });
//   }
// });

statusProspectRouter.get("/status-by-agents/:AgentId", async (req, res) => {
  const AgentId = req.params.AgentId;
  try {
    const dataSource = await getDataSource();
    const prospectStatusRepository =
      dataSource.getRepository(ProspectStatusEnt);

    const prospectStatusCounts = await prospectStatusRepository
      .createQueryBuilder("prospectStatus")
      .select("prospectStatus.statusId", "statusId")
      .addSelect("status.statusName", "statusName")
      .addSelect("COUNT(*)", "count")
      .innerJoin("prospectStatus.prospect", "prospect")
      .innerJoin("prospectStatus.status", "status")
      .where("prospect.userId = :AgentId", { AgentId })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("prospectStatus.prospectId")
          .from(ProspectStatusEnt, "prospectStatus")
          .innerJoin("prospectStatus.status", "status")
          .where("status.statusName != 'Nuevo prospecto'")
          .groupBy("prospectStatus.prospectId")
          .getQuery();
        return "prospect.id NOT IN " + subQuery;
      })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .groupBy("prospectStatus.statusId", "status.statusName") // Agregar "prospectStatus.statusId" a la cláusula GROUP BY
      .getRawMany();

    const accumulatedCounts: { [key: string]: number } = {
      "Nuevo prospecto": 0,
      "Cita agendada": 0,
      "Cita efectiva": 0,
      "Solicitud de seguro": 0,
      "Poliza pagada": 0,
      Retirado: 0,
    };

    prospectStatusCounts.forEach((count: any) => {
      const { statusName, count: statusCount } = count;
      accumulatedCounts[statusName] += statusCount;
    });

    res.status(200).json(accumulatedCounts);
  } catch (e) {
    res.status(400).json({ message: "BAD_DATA", reason: e });
  }
});

/* This code defines a route for the `statusProspectRouter` object using the HTTP GET method and a URL
parameter `:AgentId`. When a request is made to this route, it retrieves the count of new prospects
for the given agent ID. It does this by querying the database using the `getDataSource()` function
to get a connection to the database, and then using the `ProspectStatusEnt` entity to retrieve the
count of new prospects. The count is calculated by counting the number of prospect status records
that have a status name other than "Nuevo prospecto" for each prospect, and then subtracting that
count from the total number of prospect status records for each prospect. Finally, the counts are
accumulated into an object with the status ID, status name, and count, and the response is sent with
a status code of 200 and the accumulated counts as JSON. If there is an error, the response is sent
with a status code of 400 and a JSON object with a `message` property set to "BAD_DATA" and a
`reason` property with the error message. */

statusProspectRouter.get("/count-new-prospects/:AgentId", async (req, res) => {
  const AgentId = req.params.AgentId;
  try {
    const dataSource = await getDataSource();
    const prospectStatusRepository =
      dataSource.getRepository(ProspectStatusEnt);

    const prospectStatusCounts = await prospectStatusRepository
      .createQueryBuilder("prospectStatus")
      .select("prospectStatus.statusId", "statusId")
      .addSelect("status.statusName", "statusName")
      .addSelect("COUNT(*)", "count")
      .innerJoin("prospectStatus.prospect", "prospect")
      .innerJoin("prospectStatus.status", "status")
      .where("prospect.userId = :AgentId", { AgentId })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("prospectStatus.prospectId")
          .from(ProspectStatusEnt, "prospectStatus")
          .innerJoin("prospectStatus.status", "status")
          .where("status.statusName != 'Nuevo prospecto'")
          .groupBy("prospectStatus.prospectId")
          .getQuery();
        return "prospect.id NOT IN " + subQuery;
      })
      .groupBy("prospectStatus.statusId") // Agrupar solo por statusId
      .getRawMany();

    // Mapear los resultados agrupados por statusName
    const prospectStatusCountsMapped = prospectStatusCounts.map((result) => ({
      statusId: result.statusId,
      statusName: result.statusName,
      count: result.count,
    }));

    res.status(200).json(prospectStatusCountsMapped);
  } catch (e) {
    res.status(400).json({ message: "BAD_DATA", reason: e });
  }
});
