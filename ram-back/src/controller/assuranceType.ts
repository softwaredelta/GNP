// (c) Delta Software 2023, rights reserved.

import { Router, RequestHandler } from "express";
import { createAssuranceType } from "../app/assuranceType";
import { getDataSource } from "../arch/db-client";
import { AssuranceTypeEnt } from "../entities/assurance-type.entity";
export const assuranceTypeRouter = Router();
import * as j from "joi";
import { authMiddleware } from "./user";

/* This code is defining a Joi schema called `userParameters` that specifies the expected shape and
validation rules for the request body parameters of a POST request to create a new assurance type. */
const userParameters = j.object({
  name: j.string().required(),
  description: j.string().required(),
});

/**
 * This is a middleware function in TypeScript that validates user parameters and sends a 400 response
 * with an error message if the validation fails.
 * @param req - req stands for request and it is an object that contains information about the incoming
 * HTTP request such as the request method, request headers, request body, request parameters, etc. It
 * is passed as the first parameter to the middleware function.
 * @param res - `res` is the response object that is passed as a parameter to the middleware function.
 * It is used to send the response back to the client. In this case, if there is an error in the user
 * parameters, the middleware sends a 400 Bad Request response with a JSON object containing an error
 * @param next - `next` is a function that is called to pass control to the next middleware function in
 * the chain. If there are no more middleware functions left, it passes control to the route handler
 * function.
 * @returns If there is an error in validating the request body using the `userParameters` schema, a
 * response with a status code of 400 and a JSON object containing a message and the error details will
 * be returned. Otherwise, the middleware will call the `next()` function to proceed to the next
 * middleware or route handler.
 */
const saleParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = userParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
  next();
};

/* This code block is defining a POST route for creating a new assurance type. The route is accessed
through the URL path "/create". The route has two middleware functions: "authMiddleware" and
"saleParametersMiddleware". The "authMiddleware" function is used to authenticate the user making
the request, while the "saleParametersMiddleware" function is used to validate the request body
parameters. */
assuranceTypeRouter.post(
  "/create",
  authMiddleware(),
  saleParametersMiddleware,
  async (req, res) => {
    const { name, description } = req.body;
    const { assuranceType, error } = await createAssuranceType({
      name,
      description,
    });

    if (error) {
      res.status(400).json({ message: error });
      return;
    }

    res.status(201).json(assuranceType);
  },
);

/* This code block is defining a GET route for retrieving all assurance types. The route is accessed
through the URL path "/all". When a request is made to this route, it retrieves all assurance types
from the database using the "getDataSource" function and the "find" method of the "manager" property
of the database object. The retrieved assurance types are then sent as a JSON response using the
"res.json" method. 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=924979067
// * M2_S01
*/
assuranceTypeRouter.get("/all", authMiddleware(), async (req, res) => {
  const db = await getDataSource();
  const assuranceTypes = await db.manager.find(AssuranceTypeEnt);
  res.json(assuranceTypes);
});
