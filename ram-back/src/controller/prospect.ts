// (c) Delta Software 2023, rights reserved.

import { RequestHandler, Router } from "express";
import * as j from "joi";
import {
  createProspect,
  getProspectStatus,
  getProspectsByAgent,
  modifyProspect,
} from "../app/prospect";
import { getAgentById } from "../app/user";
import { getDataSource } from "../arch/db-client";
import { ProspectEnt } from "../entities/prospect.entity";
import { authMiddleware } from "./user";
export const prospectRouter = Router();

/* `const prospectParameters` is defining a Joi schema for validating the request body parameters for
creating a new prospect. It specifies that the `name`, `firstSurname`, and `secondSurname`
parameters are required and must be strings, while `comentary` and `statusId` are optional and can
also be strings. This schema is then used in the `prospectParametersMiddleware` middleware function
to validate the request body before processing the request. */
const prospectParameters = j.object({
  name: j.string().required(),
  firstSurname: j.string().required(),
  secondSurname: j.string().required(),
  comentary: j.string().optional(),
  statusId: j.string().optional(),
});
/**
 * This is a middleware function in TypeScript that validates prospect parameters in a request body and
 * sends a 400 response with an error message if validation fails.
 * @param req - req stands for request and it is an object that contains information about the incoming
 * HTTP request, such as the request method, headers, URL, and body. It is passed as the first
 * parameter to the middleware function.
 * @param res - `res` is the response object that is passed as a parameter to the middleware function.
 * It is used to send the response back to the client. In this specific code snippet, `res` is used to
 * send a 400 status code and a JSON response with an error message if the request body
 * @param next - `next` is a function that is called to pass control to the next middleware function in
 * the chain. If there are no more middleware functions left in the chain, it passes control to the
 * route handler function.
 * @returns If there is an error in validating the request body against the `prospectParameters`
 * schema, a response with a status code of 400 and a JSON object containing a message of "BAD_DATA"
 * and the error details will be returned. Otherwise, the middleware will call the `next()` function to
 * move on to the next middleware or route handler.
 */
const prospectParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = prospectParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
  next();
};

/* This code block is defining a route handler function for creating a new prospect. It is using the
`prospectRouter` object to define a POST route with the path `/create`. The route handler function
is composed of three middleware functions: `authMiddleware`, `prospectParametersMiddleware`, and an
async function that creates a new prospect. 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1119997643
// * M5_S03
*/
prospectRouter.post(
  "/create",
  authMiddleware(),
  prospectParametersMiddleware,
  async (req, res) => {
    const { name, firstSurname, secondSurname, comentary, statusId } = req.body;
    const { user } = req;

    if (!user) {
      res.status(401).json({ message: "BAD_DATA" });
      return;
    }

    const { prospect, error, reason } = await createProspect({
      name,
      firstSurname,
      secondSurname,
      comentary,
      statusId,
      userId: user.id,
    });

    if (error) {
      res.status(400).json({ message: error, reason });
      return;
    }

    res.status(201).json(prospect);
  },
);

/* This code block defines a route handler function for getting the prospects of the currently logged
in user. It uses the `prospectRouter` object to define a GET route with the path `/my-prospects`.
The route handler function is composed of two middleware functions: `authMiddleware` and an async
function that retrieves the prospects of the user.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1001315964
// * M5_S01
*/
prospectRouter.get("/my-prospects", authMiddleware(), async (req, res) => {
  const { user } = req;
  if (!user) {
    res.status(401).json({ message: "No user" });
    return;
  }

  const userId = user.id;

  const { prospects, error, reason } = await getProspectStatus({ userId });

  if (error) {
    res.status(400).json({ message: error, reason });
    return;
  }

  res.status(200).json({ prospects });
  return;
});

/* This code block defines a route handler function for getting the count of prospects for a specific
user. It uses the `prospectRouter` object to define a GET route with the path
`/count-prospects-new/:id`, where `:id` is a parameter that represents the user ID. The route
handler function retrieves the user ID from the request parameters, then uses the `getDataSource()`
function to get a connection to the database. It then uses the `count()` method of the `manager`
object to count the number of `ProspectEnt` entities that have a `userId` property equal to the user
ID. Finally, it sends a JSON response with the count of prospects. */
prospectRouter.get("/count-prospects-new/:id", async (req, res) => {
  const db = await getDataSource();
  const id = req.params.id;
  const agents = await db.manager.count(ProspectEnt, {
    where: {
      userId: id,
    },
  });
  res.json(agents);
});

/* This code block defines a route handler function for getting the prospects assigned to a specific
agent. It uses the `prospectRouter` object to define a GET route with the path
`/get-agentprospect/:id`, where `:id` is a parameter that represents the agent ID. The route handler
function retrieves the agent ID from the request parameters, then calls the `getProspectsByAgent()`
function to retrieve the prospects assigned to the agent. If there is an error in retrieving the
prospects, it sends a JSON response with a status code of 400 and an error message. If the prospects
are successfully retrieved, it calls the `getAgentById()` function to retrieve the name of the
agent, then sends a JSON response with a status code of 200 and an object containing the agent name
and the prospects assigned to the agent. */
prospectRouter.get("/get-agentprospect/:id", async (req, res) => {
  const agentId = req.params.id;

  const { prospects, error, reason } = await getProspectsByAgent({ agentId });

  if (error) {
    res.status(400).json({ message: error, reason });
    return;
  }

  const agentName = await getAgentById(agentId);
  res.status(200).json({ agentName, prospects });
});

/* This code block defines a route handler function for updating the status and status comment of a
prospect. It uses the `prospectRouter` object to define a POST route with the path
`/update-prospect`. The route handler function is composed of two middleware functions:
`authMiddleware` and an async function that modifies the status and status comment of a prospect.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=148429501
// * M5_S04
*/
prospectRouter.post("/update-prospect", authMiddleware(), async (req, res) => {
  const { statusId, statusComment, prospectId } = req.body;
  const { user } = req;

  if (!user) {
    res.status(401).json({ message: "BAD_DATA" });
    return;
  }

  const { prospect, error, reason } = await modifyProspect({
    prospectId,
    statusId,
    statusComment,
  });

  if (error) {
    console.log(error);
    res.status(400).json({ message: error, reason });
    return;
  }

  res.status(200).json(prospect);
});
