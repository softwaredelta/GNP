// (c) Delta Software 2023, rights reserved.

import { RequestHandler, Router } from "express";
import * as j from "joi";
import multer from "multer";
import { uploadFile } from "../app/file";
import { createSale, updateSale } from "../app/sale";
import { getDataSource } from "../arch/db-client";
import { SellEnt } from "../entities/sell.entity";
import { authMiddleware } from "./user";
export const salesRouter = Router();

const upload = multer();

/* `const saleParameters` is defining a schema using the `joi` library to validate the parameters of a
request body for creating a sale. It specifies that the request body must contain the following
fields: `policyNumber`, `paidDate`, `yearlyFee`, `contractingClient`, `assuranceTypeId`,
`periodicity`, `emissionDate`, `insuredCostumer`, and `paidFee`. Each field has a specific data type
and is required. This schema is later used in the `saleParametersMiddleware` middleware to validate
the request body before processing the request. */
const saleParameters = j.object({
  policyNumber: j.string().required(),
  paidDate: j.string().required(),
  yearlyFee: j.number().required(),
  contractingClient: j.string().required(),
  assuranceTypeId: j.string().required(),
  periodicity: j.string().required(),
  emissionDate: j.string().required(),
  insuredCostumer: j.string().required(),
  paidFee: j.number().required(),
});

/* `const saleUpdateParameters` is defining a schema using the `joi` library to validate the parameters
of a request body for updating the status of a sale. It specifies that the request body must contain
the `statusChange` field, which is a string and is required. This schema is later used in the
`saleUpdateParametersMiddleware` middleware to validate the request body before processing the
request. */
const saleUpdateParameters = j.object({
  statusChange: j.string().required(),
});

/**
 * This is a middleware function in TypeScript that validates sale parameters and sends a 400 response
 * with an error message if the validation fails.
 * @param req - req stands for request and it is an object that contains information about the incoming
 * HTTP request, such as the request method, headers, URL, and body. In this middleware function, it is
 * used to access the request body to validate the sale parameters.
 * @param res - `res` is the response object that is passed as a parameter to the middleware function.
 * It is used to send the response back to the client. In this specific code snippet, `res` is used to
 * send a 400 status code and a JSON response with an error message and reason if the
 * @param next - `next` is a function that is called to pass control to the next middleware function in
 * the chain. If there are no more middleware functions left in the chain, it passes control to the
 * route handler function.
 * @returns If there is an error in validating the sale parameters in the request body, a response with
 * a status code of 400 and a JSON object containing a message and the error details will be returned.
 * If there is no error, the middleware will call the next middleware function in the chain.
 */
const saleParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = saleParameters.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
  next();
};

/**
 * This function validates the request body using a predefined schema and sends a 400 response with an
 * error message if the validation fails.
 * @param req - req stands for request and it is an object that contains information about the incoming
 * HTTP request, such as the request headers, request parameters, request body, etc. It is passed as
 * the first parameter to the middleware function.
 * @param res - `res` is the response object that is passed as a parameter to the middleware function.
 * It is used to send the response back to the client. In this specific code snippet, `res` is used to
 * send a 400 status code and a JSON response with an error message and reason if the
 * @param next - `next` is a function that is called to pass control to the next middleware function in
 * the chain. It is typically used to move on to the next middleware function after the current
 * middleware function has completed its task. If `next()` is not called, the request will be left
 * hanging and the client
 * @returns If there is an error in validating the request body against the `saleUpdateParameters`
 * schema, a response with status code 400 and a JSON object containing a message "BAD_DATA" and the
 * error details will be returned. Otherwise, the middleware will call the `next()` function to proceed
 * to the next middleware or route handler.
 */
const saleUpdateParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = saleUpdateParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
  next();
};

/* This code defines a route handler for creating a new sale. It listens for POST requests to the
"/create" endpoint of the salesRouter. The handler function first uses several middleware functions
to validate the request body and authenticate the user. Then, it extracts the necessary data from
the request body and user object, and checks if a file was uploaded with the request. If there is no
user or file, it sends an appropriate error response. If a file was uploaded, it calls the
`uploadFile` function to upload the file to a storage service and get the URL of the uploaded file.
Then, it calls the `createSale` function to create a new sale in the database with the extracted
data and the URL of the uploaded file. If there is an error during the creation of the sale, it
sends an error response with the error message and reason. If the sale is created successfully, it
sends a response with a status code of 201 and the created sale object. 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=924979067
// * M2_S01
*/
salesRouter.post(
  "/create",
  authMiddleware(),
  upload.single("file"),
  saleParametersMiddleware,
  async (req, res) => {
    const {
      policyNumber,
      paidDate,
      yearlyFee,
      contractingClient,
      assuranceTypeId,
      periodicity,
      emissionDate,
      insuredCostumer,
      paidFee,
    } = req.body;
    const { user } = req;

    if (!user) {
      res.status(401).json({ message: "BAD_DATA" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: "NO_FILE_UPLOAD" });
      return;
    }

    const evidenceUrl: string = await uploadFile({ file: req.file });

    const { sale, error, reason } = await createSale({
      policyNumber,
      paidDate,
      yearlyFee,
      contractingClient,
      assuranceTypeId,
      userId: user.id,
      periodicity,
      emissionDate,
      insuredCostumer,
      paidFee,
      evidenceUrl,
    });

    if (error) {
      res.status(500).json({ message: error, reason });
      return;
    }

    res.status(201).json(sale);
  },
);
/* This code defines a route handler for getting all sales from the database. It listens for GET
requests to the "/all" endpoint of the salesRouter. The handler function first gets a database
connection using the `getDataSource` function, then uses the `createQueryBuilder` method of the
database manager to create a query builder for the `SellEnt` entity. It specifies that it wants to
select all sales and join the `assuranceType` entity using a left join. Finally, it calls the
`getMany` method to execute the query and get an array of all sales with their associated assurance
types. The handler function sends the array of sales as a JSON response using the `res.json` method. */

salesRouter.get("/all", authMiddleware(), async (req, res) => {
  const db = await getDataSource();
  const sales = await db.manager
    .createQueryBuilder(SellEnt, "sell")
    .leftJoinAndSelect("sell.assuranceType", "assuranceType")
    .getMany();
  res.json(sales);
});
/* This code defines a route handler for deleting a sale from the database. It listens for POST
requests to the "/delete/:id" endpoint of the salesRouter, where ":id" is a parameter representing
the ID of the sale to be deleted. The handler function first gets a database connection using the
`getDataSource` function, then uses the `getRepository` method of the database manager to get the
repository for the `SellEnt` entity. Finally, it calls the `delete` method of the repository with
the ID of the sale to be deleted and sends the result as a JSON response using the `res.json`
method. */

salesRouter.post("/delete/:id", authMiddleware(), async (req, res) => {
  const db = await getDataSource();
  const sales = await db.manager.getRepository(SellEnt).delete(req.params.id);
  res.json(sales);
});

/* The above code is defining a route for retrieving sales data for a specific user. It first checks if
there is a user authenticated using the `authMiddleware()` function. If there is no authenticated
user, it returns a 401 Unauthorized response. If there is an authenticated user, it retrieves the
user's ID from the request object and uses it to query the database for all sales records associated
with that user. The `relations` option is used to include related entities (assuranceType and user)
in the query results. Finally, it returns the sales data in JSON format. 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=832442920
// * M2_S02
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1423929641
// * M2_S03 
*/
salesRouter.get("/my-sales", authMiddleware(), async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "No user" });
    return;
  }
  const userId = req.user.id;
  const db = await getDataSource();
  const sales = await db.manager.find(SellEnt, {
    relations: { assuranceType: true, user: true },
    where: { userId },
  });

  res.json(sales);
});

/* The above code is defining a route for a sales verification endpoint that returns a list of pending
sales that have not been reviewed yet. It uses an authentication middleware to ensure that only
authorized users can access the endpoint. The code then connects to a database, retrieves all sales
that have a status of "sin revisar" (which means "unreviewed" in Spanish), and includes the related
user and assuranceType entities. Finally, it sends a JSON response containing the list of pending
sales. 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1338476890
// * M2_S04
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=224223021
// * M2_S05
*/
salesRouter.get("/verify-sales/pending", authMiddleware(), async (req, res) => {
  const db = await getDataSource();
  const sales = await db.manager.find(SellEnt, {
    relations: { user: true, assuranceType: true },
    where: { status: "sin revisar" },
  });

  res.json({ sales });
});
/* The above code is defining a route for a sales verification endpoint that requires authentication
middleware. When a GET request is made to this endpoint, the code retrieves a database connection
and uses it to find all sales that have been approved (status: "aceptada"). The code also includes
the related user and assuranceType entities in the query results. Finally, the code sends a JSON
response containing the retrieved sales data. 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1338476890
// * M2_S04
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=224223021
// * M2_S05
*/

salesRouter.get("/verify-sales/aproved", authMiddleware(), async (req, res) => {
  const db = await getDataSource();
  const sales = await db.manager.find(SellEnt, {
    relations: { user: true, assuranceType: true },
    where: { status: "aceptada" },
  });
  res.json({ sales });
});
/* The above code is defining a route for a sales verification endpoint that requires authentication
middleware. When a GET request is made to this endpoint, the code retrieves a database connection
and queries the database for all sales that have a status of "rechazada" (rejected). The code then
returns a JSON response containing the retrieved sales data, including related user and
assuranceType information. 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1338476890
// * M2_S04
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=224223021
// * M2_S05
*/
salesRouter.get("/verify-sales/refused", authMiddleware(), async (req, res) => {
  const db = await getDataSource();
  const sales = await db.manager.find(SellEnt, {
    relations: { user: true, assuranceType: true },
    where: { status: "rechazada" },
  });
  res.json({ sales });
});

/* The above code is defining a route for updating the status of a sale in a sales system. The route is
accessed via a POST request to "/update-status/:id", where ":id" is the ID of the sale to be
updated. The route is protected by an authentication middleware and a middleware for validating the
request parameters.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1338476890
// * M2_S04
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=224223021
// * M2_S05
*/
salesRouter.post(
  "/update-status/:id",
  authMiddleware(),
  saleUpdateParametersMiddleware,
  async (req, res) => {
    const { statusChange } = req.body;
    const db = await getDataSource();
    await db.manager
      .createQueryBuilder()
      .update(SellEnt)
      .set({ status: statusChange })
      .where("id = :id", { id: req.params.id })
      .execute();

    const changedSale = await db.manager.findOne(SellEnt, {
      relations: { user: true, assuranceType: true },
      where: { id: req.params.id },
    });

    res.json({ changedSale });
  },
);

/* The above code is defining a route for updating a sale record in a sales database. The route is
accessed via a POST request to "/update/:id". The route is protected by an authentication middleware
function. The route expects the request body to contain data for updating the sale record, including
policyNumber, paidDate, yearlyFee, contractingClient, assuranceTypeId, periodicity, emissionDate,
insuredCostumer, and paidFee. The route also expects a file to be uploaded or an evidenceUrl to be
provided in the request body. The file or evidenceUrl is used as evidence for the sale record 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=877323064
// * M2_S06
*/
salesRouter.post(
  "/update/:id",
  authMiddleware(),
  upload.single("file"),
  async (req, res) => {
    const {
      policyNumber,
      paidDate,
      yearlyFee,
      contractingClient,
      assuranceTypeId,
      periodicity,
      emissionDate,
      insuredCostumer,
      paidFee,
    } = req.body;
    const { user } = req;
    if (!user) {
      res.status(401).json({ message: "NO_USER" });
      return;
    }

    const { file } = req;

    if (!file && !req.body.evidenceUrl) {
      res.status(400).json({ message: "NO_FILE_UPLOAD" });
      return;
    }

    const evidenceUrl = !!file
      ? await uploadFile({ file })
      : req.body.evidenceUrl;

    const { sale, error } = await updateSale({
      id: req.params.id,
      policyNumber,
      paidDate,
      yearlyFee,
      contractingClient,
      assuranceTypeId,
      periodicity,
      emissionDate,
      insuredCostumer,
      paidFee,
      userId: user.id,
      evidenceUrl: evidenceUrl,
    });

    if (error) {
      res.status(500).json({ message: error });
      return;
    }

    res.json({ sale });
  },
);

/* The above code is defining a GET endpoint for retrieving a sale by its ID. It uses an authentication
middleware to ensure that only authorized users can access the endpoint. It then connects to a
database using the `getDataSource()` function and retrieves a sale entity from the database using
the `findOne()` method of the entity manager. The `findOne()` method takes in the `SellEnt` entity
as the first argument, and an object as the second argument that specifies the relations to be
loaded and the conditions for the query. In this case, it loads the `assuranceType` and `user`
relations 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=877323064
// * M2_S06
*/
salesRouter.get("/:id", authMiddleware(), async (req, res) => {
  const db = await getDataSource();
  const sale = await db.manager.findOne(SellEnt, {
    relations: { assuranceType: true, user: true },
    where: { id: req.params.id },
  });

  res.json(sale);
});
