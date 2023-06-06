// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { authMiddleware } from "./user";
import { getDataSource } from "../arch/db-client";
import { DeliveryEnt } from "../entities/delivery.entity";
import { DeliveryLinkEnt } from "../entities/delivery-link.entity";
import {
  DeliveryError,
  createDelivery,
  createLinkDelivery,
  deleteDelivery,
  getDeliveryGroup,
  getUserDeliveriesbyGroup,
  setDeliveryToAllUsers,
  updateDelivery,
  updateDeliveryStatus,
  updateLinkDelivery,
} from "../app/deliveries";
import { UserRole } from "../entities/user.entity";
import {
  UserDeliveryEnt,
  StatusUserDelivery,
} from "../entities/user-delivery.entity";
import * as j from "joi";
import { RequestHandler } from "express";
import { getS3Api } from "../arch/s3-client";
import path from "path";
import multer from "multer";
import { uploadFile } from "../app/file";

export const deliveriesRouter = Router();

/* Defining a Joi schema for the request body parameters of the "update-status" endpoint. The schema
requires a "userId" parameter of type string and a "statusChange" parameter of type boolean, both of
which are required. This schema is later used in the "updateParametersMiddleware" middleware to
validate the request body before processing the request. */
const updateParameters = j.object({
  userId: j.string().required(),
  statusChange: j.boolean().required(),
});

const upload = multer();

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
 * the chain. It is typically used to move on to the next middleware function or to move on to the
 * final route handler function. If `next()` is not called, the request will be left hanging and the
 * @returns If there is an error in validating the request body against the `updateParameters` schema,
 * a response with status code 400 and a JSON object containing a message and the error details will be
 * returned. Otherwise, the middleware will call the `next()` function to proceed to the next
 * middleware or route handler.
 */
const updateParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = updateParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
  next();
};

/* This code defines a route handler for the HTTP GET request to retrieve all deliveries for a specific
user and group. The route is defined as `/my-deliveries/:groupId`, where `:groupId` is a parameter
in the URL that specifies the group ID. The `authMiddleware()` function is used as middleware to
ensure that the user is authenticated before accessing this route. */
deliveriesRouter.get(
  "/my-deliveries/:groupId",
  authMiddleware(),
  async (req, res) => {
    if (!req.user) {
      res.status(401).json({ message: "No user" });
      return;
    }
    const userId = req.user.id;
    const groupId = req.params.groupId;

    const { userDeliveries, error } = await getUserDeliveriesbyGroup({
      userId,
      groupId,
    });

    if (error) {
      throw new Error(error);
    }

    res.json(userDeliveries);
  },
);

/* This code defines a route handler for the HTTP GET request to retrieve all deliveries. When a GET
request is made to the "/all" endpoint, the function retrieves all the delivery entities from the
database using the `find()` method of the `manager` object of the `db` object returned by the
`getDataSource()` function. The retrieved deliveries are then sent as a JSON response to the client
using the `res.json()` method. */
deliveriesRouter.get("/all", async (req, res) => {
  const db = await getDataSource();
  const deliveries = await db.manager.find(DeliveryEnt);

  res.json({ deliveries });
});

/* This code defines a route handler for the HTTP GET request to retrieve all user deliveries. When a
GET request is made to the "/all-user" endpoint, the function retrieves all the user delivery
entities from the database using the `find()` method of the `manager` object of the `db` object
returned by the `getDataSource()` function. The retrieved user deliveries are then sent as a JSON
response to the client using the `res.json()` method. */
deliveriesRouter.get("/all-user", async (req, res) => {
  const db = await getDataSource();
  const deliveries = await db.manager.find(UserDeliveryEnt);

  res.json({ deliveries });
});

/* The above code is defining a route for getting a delivery by its ID. It requires authentication with
the role of MANAGER. It then retrieves the delivery from the database using the ID provided in the
request parameters and includes the related userDeliveries and user entities. If the delivery is not
found, it returns a 404 error. Otherwise, it returns the delivery object in JSON format. 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=840613660
// * M1_S06 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=95397343
// * M1_S07
*/
deliveriesRouter.get(
  "/:id",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const ds = await getDataSource();
    const id = req.params.id;

    const delivery = await ds.manager.findOne(DeliveryEnt, {
      where: {
        id,
      },
      relations: ["userDeliveries", "userDeliveries.user"],
    });

    if (!delivery) {
      res.status(404).json({ message: "Delivery not found" });
      return;
    }

    res.json(delivery);
  },
);

/* The above code is defining a route for getting pending deliveries for a specific delivery ID. It
requires authentication with the role of MANAGER. It then retrieves the delivery from the database
using the provided ID and checks if there are any user deliveries associated with it that have a
status of "sending". If there are no pending deliveries, it returns a 404 error. Otherwise, it
returns the delivery object with the associated user deliveries and users. 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=840613660
// * M1_S06
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=95397343
// * M1_S07
*/
deliveriesRouter.get(
  "/pending/:id",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const ds = await getDataSource();
    const id = req.params.id;

    const delivery = await ds.manager.findOne(DeliveryEnt, {
      relations: ["userDeliveries", "userDeliveries.user"],
      where: {
        id,
        userDeliveries: {
          status: StatusUserDelivery.sending,
        },
      },
    });

    if (!delivery) {
      res.status(404).json({ message: "Delivery not found" });
      return;
    }

    res.json(delivery);
  },
);

/* The above code is defining a route for a GET request to retrieve a delivery that has been reviewed
by a manager. The route requires authentication with a manager role. The route takes an ID parameter
for the delivery to be retrieved. The code then queries the database to find the delivery with the
specified ID and with user deliveries that have been accepted or refused. If the delivery is found,
it is returned in the response. If not, a 404 error is returned.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=840613660
// * M1_S06
*/
deliveriesRouter.get(
  "/reviewed/:id",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const ds = await getDataSource();
    const id = req.params.id;

    const delivery = await ds.manager.findOne(DeliveryEnt, {
      relations: ["userDeliveries", "userDeliveries.user"],
      where: [
        {
          id,
          userDeliveries: {
            status: StatusUserDelivery.accepted,
          },
        },
        {
          id,
          userDeliveries: {
            status: StatusUserDelivery.refused,
          },
        },
      ],
    });

    if (!delivery) {
      res.status(404).json({ message: "Delivery not found" });
      return;
    }

    res.json(delivery);
  },
);

/* The above code is defining a route for updating the status of a delivery. It is using the Express
framework for Node.js and TypeScript. The route is accessed via a POST request to
"/update-status/:id", where ":id" is the ID of the delivery to be updated.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=95397343
// * M1_S07
*/
deliveriesRouter.post(
  "/update-status/:id",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  updateParametersMiddleware,
  async (req, res) => {
    const { userId, statusChange } = req.body;
    const deliveryId = req.params.id;
    const changedDelivery = await updateDeliveryStatus({
      userId,
      deliveryId,
      statusChange,
    });

    res.json({ changedDelivery });
  },
);

/* The above code is defining a route for creating a delivery for a specific group. It requires
authentication with a manager role. It also allows for uploading an image file. The delivery
information is extracted from the request body and a file is extracted if it exists. If a file
exists, it is uploaded to an S3 bucket and the filename is stored in the delivery object. The
delivery is then created and associated with all users in the group. Finally, a response is sent
with the created delivery object. 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1167543919
// * M1_S010
*/
deliveriesRouter.post(
  "/create-delivery/:groupId",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  upload.single("image"),
  async (req, res) => {
    const { deliveryName, description } = req.body;
    const file = req.file;
    let data;
    if (file) {
      const s3 = await getS3Api();
      const filename: string = Date.now() + path.extname(file.originalname);
      await s3.putObject(filename, file.buffer);

      data = await createDelivery({
        idGroup: req.params.groupId,
        deliveryName,
        description,
        imageUrl: filename,
      });
    } else {
      data = await createDelivery({
        idGroup: req.params.groupId,
        deliveryName,
        description,
        imageUrl: "undefined",
      });
    }

    const { delivery, error } = data;
    if (error) {
      res.status(500).json({ error });
      return;
    }

    await setDeliveryToAllUsers({
      idDelivery: delivery.id,
      idGroup: req.params.groupId,
      fileUrl: delivery.imageUrl,
      status: StatusUserDelivery.withoutSending,
      dateDelivery: new Date(),
    });

    res.status(201).json({ delivery });
  },
);

/* The above code is defining a DELETE endpoint for deleting a delivery with a specific ID. It uses an
authentication middleware to ensure that only users with the role of MANAGER can access this
endpoint. It then calls the `deleteDelivery` function with the delivery ID extracted from the
request parameters. If there is an error, it logs the reason and returns a 500 error response with
the error and reason. If the deletion is successful, it returns a 200 response with a message
indicating that the delivery has been deleted. */
deliveriesRouter.delete(
  "/:id",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const { error, reason } = await deleteDelivery({
      deliveryId: req.params.id,
    });

    if (error) {
      console.error(reason);
      res.status(500).json({ error, reason });
      return;
    }

    res.status(200).json({ message: "Delivery deleted" });
  },
);

/* The above code is defining a route for GET requests to "/group-delivery/:deliveryId" endpoint. It is
using an authentication middleware to ensure that the user is authenticated before proceeding. If
the user is not authenticated, it returns a 401 status code with a message "No user". If the user is
authenticated, it retrieves the delivery group information for the specified deliveryId using the
getDeliveryGroup function. If there is an error, it throws an error. If there is no error, it
returns the delivery group information in JSON format.

 * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1855489237
 * M1_S02
*/
deliveriesRouter.get(
  "/group-delivery/:deliveryId",
  authMiddleware(),
  async (req, res) => {
    if (!req.user) {
      res.status(401).json({ message: "No user" });
      return;
    }

    const deliveryId = req.params.deliveryId;

    const { delivery, error } = await getDeliveryGroup({
      deliveryId,
    });

    if (error) {
      throw new Error(error);
    }

    res.json(delivery);
  },
);

/* The above code is defining a route for deleting a delivery link. It checks if the request body
contains an 'id' field, and if not, it returns a 400 error response. If the 'id' field is present,
it connects to a database using the 'getDataSource' function, and deletes the delivery link with the
specified id using the 'delete' method of the DeliveryLinkEnt repository. It then returns a JSON
response with the deleted link. If there is an error during the process, it returns a 500 error
response. */
deliveriesRouter.post(
  "/delete-delivery-link",
  authMiddleware(),
  async (req, res) => {
    if (!req.body.id) {
      res.status(400).json({ message: "El campo 'id' es requerido." });
      return;
    }

    try {
      const db = await getDataSource();
      const result = await db.manager
        .getRepository(DeliveryLinkEnt)
        .delete(req.body.id);

      res.json({ links: result });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Ocurrió un error al eliminar el enlace." });
    }
  },
);

/* The above code is defining a route for creating a delivery link for a specific delivery. It requires
authentication with a manager role. It receives the delivery ID, link, and name from the request
body. It then calls the `createLinkDelivery` function with the provided data and returns the
generated link if successful. If there is an error, it returns a 500 status code with the error
message. 
 * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1667428796
 * M1_S03
 * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1287058613
 * M1_S05
*/
deliveriesRouter.post(
  "/create-delivery-link/:deliveryId",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const deliveryId = req.params.deliveryId;
    const { link, name } = req.body;

    const data = await createLinkDelivery({
      deliveryId,
      link,
      name,
    });

    const { link: link2, error } = data;
    if (error) {
      res.status(500).json({ error });
      return;
    } else {
      res.json(link2);
    }
  },
);

/* The above code is defining a route for updating the link of a delivery. When a POST request is made
to the "/update-delivery-link" endpoint, the authMiddleware function is called to authenticate the
user. Then, the request body is destructured to get the link, name, and id of the delivery to be
updated. The updateLinkDelivery function is called with the id, link, and name as parameters to
update the delivery link. Finally, the updated link is sent back as a JSON response. */
deliveriesRouter.post(
  "/update-delivery-link",
  authMiddleware(),
  async (req, res) => {
    const { link, name, id } = req.body;
    const changedLink = await updateLinkDelivery({
      id,
      link,
      name,
    });

    res.json({ changedLink });
  },
);

/* The above code is defining a route for updating a delivery with a specific ID. The route is
protected by an authentication middleware that only allows users with the role of "manager" to
access it. The route expects a JSON payload with optional fields for deliveryName, description, and
hasDelivery. The route also expects a single file upload with the key "image". If the payload or
file is invalid, the route will return a 400 error. If the delivery with the specified ID is not
found, the route will return a 404 error. If there is an error during the update process, the */
deliveriesRouter.post(
  "/:id",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  upload.single("image"),
  async (req, res) => {
    const schema = j.object({
      deliveryName: j.string().optional(),
      description: j.string().optional(),
      hasDelivery: j.string().optional(),
    });
    const { error: validationError } = schema.validate(req.body);
    if (validationError) {
      res.status(400).json({ message: "BAD_DATA", reason: validationError });
      return;
    }

    const body = req.body;
    const file = req.file;
    const id = req.params.id;

    if (!file && !body.deliveryName && !body.description) {
      res.status(400).json({ message: "BAD_DATA" });
      return;
    }

    const imageUrl = await (async () => {
      if (!file) return undefined;
      return uploadFile({ file });
    })();

    const { delivery, error, errorReason } = await updateDelivery({
      deliveryId: id,
      deliveryName: body.deliveryName,
      description: body.description,
      imageUrl,
      hasDelivery: body.hasDelivery,
    });

    if (error && error === DeliveryError.NOT_FOUND) {
      res.status(404).json({ error });
      return;
    }
    if (error) {
      res.status(500).json({ error: validationError, errorReason });
      console.error(errorReason);
      return;
    }

    res.json(delivery);
  },
);
