// (c) Delta Software 2023, rights reserved.
import { Router } from "express";
import { getProspectStatus } from "../app/satus-prospect";
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
