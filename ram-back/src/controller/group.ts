// (c) Delta Software 2023, rights reserved.

import { RequestHandler, Router } from "express";
import * as J from "joi";
import * as j from "joi";
import multer from "multer";
import {
  GroupError,
  addUserToGroup,
  createGroup,
  createGroupWithFile,
  deleteGroup,
  getUserGroups,
  getUsersByGroup,
  removeUserFromGroup,
  updateGroup,
  updateGroupWithFile,
} from "../app/groups";
import { setUserToAllDeliveries } from "../app/user-delivery";
import { getDataSource } from "../arch/db-client";
import { GroupEnt } from "../entities/group.entity";
import { UserRole } from "../entities/user.entity";
import { authMiddleware } from "./user";

export const groupsRouter = Router();
const upload = multer();

/* `const updateParameters` is defining a schema for validating the request body parameters for
updating a group. It uses the `joi` library to define an object schema with three properties:
`name`, `description`, and `imageUrl`, all of which are expected to be strings. This schema is later
used as middleware to validate the request body before processing the update request. */
const updateParameters = j.object({
  name: j.string(),
  description: j.string(),
  imageUrl: j.string(),
});

/**
 * This is a middleware function in TypeScript that validates the request body using a schema and sends
 * a 400 response with an error message if the validation fails.
 * @param req - req stands for request and it is an object that contains information about the incoming
 * HTTP request such as the request method, request headers, request body, request parameters, etc. It
 * is one of the parameters of the middleware function.
 * @param res - `res` stands for response. It is an object that represents the HTTP response that an
 * Express server sends when it receives an HTTP request. The `res` object has methods and properties
 * that allow you to set the HTTP status code, headers, and body of the response. In the code snippet
 * above
 * @param next - `next` is a function that is called to pass control to the next middleware function in
 * the chain. It is typically used to move on to the next middleware function or to the final route
 * handler function. If `next()` is not called, the request will be left hanging and the client will
 * not
 * @returns If there is an error in validating the request body against the `updateParameters` schema,
 * a response with status code 400 and a JSON object containing a message and the error details will be
 * returned. Otherwise, the middleware will call the `next()` function to pass control to the next
 * middleware function in the chain.
 */
const updateParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = updateParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
  next();
};

/* This code defines a route handler for the HTTP GET request to the "/all" endpoint of the groups API.
The handler function retrieves all groups from the database and returns them as a JSON response. The
route is protected by the `authMiddleware` middleware function, which requires the user to have the
`MANAGER` role to access this endpoint. The `getDataSource` function is used to get a connection to
the database, and the `GroupEnt` entity is used to query the groups table. The `select` option is
used to specify which columns to include in the result set, and the `relations` option is used to
specify which related entities to include in the result set. Finally, the `res.json` method is used
to send the groups data as a JSON response to the client. 
* Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=2144727033
* M1_S04
*/
groupsRouter.get(
  "/all",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const ds = await getDataSource();
    const groups = await ds.manager.find(GroupEnt, {
      select: ["id", "name", "description", "imageUrl", "groupUsers"],
      relations: ["groupUsers"],
    });

    res.json(groups);
  },
);

/* This code defines a route handler for the HTTP GET request to the "/my-groups" endpoint of the
groups API. The handler function retrieves all groups that the current user is a member of from the
database and returns them as a JSON response. The route is protected by the `authMiddleware`
middleware function, which requires the user to be authenticated to access this endpoint. If the
user is not authenticated, a 401 response with a "No user" message is returned. If the user is
authenticated, their user ID is extracted from the request object and passed to the `getUserGroups`
function, which retrieves the user's groups from the database. The groups data is then sent as a
JSON response to the client. 

Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=957708639
M1_S01
*/
groupsRouter.get("/my-groups", authMiddleware(), async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "No user" });
    return;
  }
  const userId = req.user.id;

  const data = await getUserGroups({ userId });

  res.json({ data });
});

/* This code defines a route handler for the HTTP GET request to the "/:id" endpoint of the groups API.
The handler function retrieves a specific group from the database based on the `id` parameter in the
request URL and returns it as a JSON response. The `getDataSource` function is used to get a
connection to the database, and the `GroupEnt` entity is used to query the groups table. The
`select` option is used to specify which columns to include in the result set, and the `relations`
option is used to specify which related entities to include in the result set. Finally, the
`res.json` method is used to send the group data as a JSON response to the client. */
groupsRouter.get("/:id", authMiddleware(), async (req, res) => {
  const ds = await getDataSource();
  const groups = await ds.manager.findOne(GroupEnt, {
    select: ["id", "name", "deliveries", "imageUrl"],
    relations: ["deliveries", "deliveries.userDeliveries"],
    where: {
      id: req.params.id,
    },
  });

  res.json(groups);
});

/* This code defines a route handler for the HTTP GET request to the "/users/:id" endpoint of the
groups API. The handler function retrieves all users who are members of a specific group from the
database and returns them as a JSON response. The route is protected by the `authMiddleware`
middleware function, which requires the user to have the `MANAGER` role to access this endpoint. The
`getUsersByGroup` function is used to retrieve the users data from the database, and the `res.json`
method is used to send the users data as a JSON response to the client. If there is an error in
retrieving the users data, a 500 response with an error message is returned.
* Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=2144727033
* M1_S04
*/
groupsRouter.get(
  "/users/:id",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    try {
      const groupUsers = await getUsersByGroup(req.params.id);
      res.json(groupUsers);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving group users", error });
    }
  },
);

/* This code defines a route handler for the HTTP DELETE request to the "/:id" endpoint of the groups
API. The handler function deletes a specific group from the database based on the `id` parameter in
the request URL. The `deleteGroup` function is called with the `groupId` parameter extracted from
the request object, and the group is deleted from the database. Finally, a 200 response is sent to
the client to indicate that the group was successfully deleted. The route is protected by the
`authMiddleware` middleware function, which requires the user to have the `MANAGER` role to access
this endpoint. */
groupsRouter.delete(
  "/:id",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    await deleteGroup({
      groupId: req.params.id,
    });

    res.status(200).send();
  },
);

/* The above code is defining a route for creating a new group. It requires authentication with the
role of MANAGER. It expects a POST request with a JSON body containing a name (string, minimum
length of 3) and an optional description (string). It also allows for an image file to be uploaded
with the request. The code then validates the input using a JSON schema and creates a new group with
the provided information. If the group already exists, it returns a 409 conflict error. If there is
any other error, it returns a 500 error. If the group is created successfully. 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1943755342
// * M1_S08
*/
groupsRouter.post(
  "/create",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  upload.single("image"),
  async (req, res) => {
    const schema = J.object({
      name: J.string().min(3).required(),
      description: J.string().allow("").optional(),
    });

    const { error: validationError } = schema.validate(req.body);
    if (validationError) {
      res.status(400).json({ message: validationError.message });
      return;
    }

    const { name, description } = req.body;
    const file = req.file;

    let data;
    if (file) {
      data = await createGroupWithFile({
        name,
        description,
        imageFile: file,
      });
    } else {
      data = await createGroup({
        name,
        description,
      });
    }

    const { group, error } = data;
    if (error) {
      if (error === GroupError.CONFLICT) {
        res.status(409).json({ message: "Group already exists" });
        return;
      }
      res.status(500).json({ error });
    } else {
      res.status(201).json(group);
    }
  },
);

/* The above code is defining a route for updating a group with a given groupId. The route requires
authentication with the MANAGER role and validation of request parameters using middleware. The
request body is validated using a schema and if there are any validation errors, a 400 response is
sent. The request body is then used to update the group with the given groupId. If an image file is
included in the request, the group is updated with the image file, otherwise, only the name and
description are updated. If there is an error during the update process, an appropriate error
response is sent.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=819425274
// * M1_S09
*/
groupsRouter.post(
  "/update/:groupId",
  updateParametersMiddleware,
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  upload.single("image"),
  async (req, res) => {
    const { groupId } = req.params;

    const schema = J.object({
      name: J.string().min(3).optional(),
      description: J.string().allow("").optional(),
    });

    const { error: validationError } = schema.validate(req.body);
    if (validationError) {
      res.status(400).json({ message: validationError.message });
      return;
    }

    const { name, description } = req.body;
    const file = req.file;

    let data;
    if (file) {
      data = await updateGroupWithFile({
        groupId,
        name,
        description,
        imageFile: file,
      });
    } else {
      data = await updateGroup({
        groupId,
        name,
        description,
      });
    }

    const { group, error, errorReason } = data;
    if (error) {
      if (error === GroupError.NOT_FOUND) {
        res.status(404).json({ message: "Group not found" });
      } else {
        res.status(500).json({ error, errorReason });
      }
    } else {
      res.json(group);
    }
  },
);

/* The above code is defining a route for adding a user to a group in a web application. The route is
accessed via a POST request to "/:id/add-user", where ":id" is the ID of the group to which the user
is being added. The route is protected by an authentication middleware that only allows users with
the "MANAGER" role to access it. */
groupsRouter.post(
  "/:id/add-user",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res, next) => {
    const schema = J.object({
      userId: J.string().required(),
    });
    const { error: validationError } = schema.validate(req.query);
    if (validationError) {
      res.status(400).json({ message: validationError.message });
      return;
    }

    next();
  },
  async (req, res) => {
    const userId = req.query.userId as string;
    const groupId = req.params.id;

    await addUserToGroup({ groupId, userId });
    await setUserToAllDeliveries({
      groupId,
      userId,
    });
    res.status(200).send();
  },
);

/* The above code is defining a route for removing a user from a group. The route is a POST request to
"/:id/remove-user" where ":id" is the ID of the group from which the user is to be removed. The
route is protected by an authentication middleware that only allows users with the role of "MANAGER"
to access it. */
groupsRouter.post(
  "/:id/remove-user",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res, next) => {
    const schema = J.object({
      userId: J.string().required(),
    });
    const { error: validationError } = schema.validate(req.query);
    if (validationError) {
      res.status(400).json({ message: validationError.message });
      return;
    }

    next();
  },
  async (req, res) => {
    const userId = req.query.userId as string;
    const groupId = req.params.id;

    const { error, errorReason } = await removeUserFromGroup({
      groupId,
      userId,
    });
    if (error) {
      res.status(500).json({ error, errorReason });
      console.error(errorReason);
      return;
    }

    res.status(200).send();
  },
);
