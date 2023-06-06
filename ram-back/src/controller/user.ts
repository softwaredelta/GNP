// (c) Delta Software 2023, rights reserved.

import { RequestHandler, Router } from "express";
import * as j from "joi";
import { TokenType, generateToken, verifyToken } from "../app/auth";
import {
  authenticateUser,
  createUser,
  fuzzySearchUsers,
  validateUserToken,
  getAllUserRol,
  updateUser,
  resetPassword,
  addLink,
  updateLink,
} from "../app/user";
import { getDataSource } from "../arch/db-client";
import { UserEnt, UserRole } from "../entities/user.entity";
import multer from "multer";
import { uploadFile } from "../app/file";
import { UserLinkEnt } from "../entities/user-link.entity";

const upload = multer();

export const authRouter = Router();

/* `userParameters` is a Joi schema object that defines the validation rules for the request body
parameters of the `/create` and `/authenticate` routes in the authentication router. It specifies
that the `email` parameter must be a valid email address and is required, the `password` parameter
must be at least 8 characters long and is required, the `confirmPassword` parameter must be a string
that matches the `password` parameter and is optional, the `name`, `lastName`, `mobile`, `role`,
`urlPP200`, and `CUA` parameters are all optional and have specific validation rules. These
validation rules ensure that the request body parameters are valid before they are used in the
authentication process or to create a new user. */
const userParameters = j.object({
  email: j.string().email().required(),
  password: j.string().min(8).required(),
  confirmPassword: j.string().valid(j.ref("password")).optional(),
  name: j.string().optional(),
  lastName: j.string().optional(),
  mobile: j.number().optional(),
  role: j.string().valid(UserRole.MANAGER, UserRole.REGULAR).optional(),
  urlPP200: j.string().optional().allow("").default(""),
  CUA: j.string().optional().allow("").default(""),
});

/* This code defines a Joi schema object called `resetPasswordParameters` that specifies the validation
rules for the request body parameters of the `/reset-password` route in the authentication router.
It specifies that the `email` parameter must be a valid email address and is required, and the
`password` parameter must be at least 8 characters long and is required. These validation rules
ensure that the request body parameters are valid before they are used to reset a user's password. */
const resetPasswordParameters = j.object({
  email: j.string().email().required(),
  password: j.string().min(8).required(),
});

/**
 * This is a middleware function in TypeScript that validates reset password parameters and sends a 400
 * response with an error message if the parameters are invalid.
 * @param req - req stands for request and it is an object that contains information about the incoming
 * HTTP request, such as the request headers, request parameters, request body, and more. In this
 * middleware, it is used to validate the request body using the `resetPasswordParameters` schema.
 * @param res - `res` is the response object in the Express middleware function. It is used to send a
 * response back to the client making the request. In this specific middleware function, `res` is used
 * to send a 400 status code and a JSON response with an error message and reason if the request body
 * @param next - `next` is a function that is called to pass control to the next middleware function in
 * the chain. If there are no more middleware functions left in the chain, it passes control to the
 * route handler function.
 * @returns If there is an error in validating the reset password parameters in the request body, a
 * response with a status code of 400 and a JSON object containing a message and the error reason will
 * be returned. Otherwise, the middleware will call the next middleware function.
 */
const resetPasswordParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = resetPasswordParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
  next();
};

/**
 * This is a middleware function in TypeScript that validates user parameters and sends a 400 response
 * with an error message if the validation fails.
 * @param req - req stands for request and it is an object that contains information about the incoming
 * HTTP request, such as the request method, headers, URL, and body. It is passed as a parameter to the
 * middleware function.
 * @param res - `res` is the response object that is passed as a parameter to the middleware function.
 * It is used to send the response back to the client. In this specific code snippet, `res` is used to
 * send a 400 status code and a JSON response with an error message if the user parameters
 * @param next - `next` is a function that is called to pass control to the next middleware function in
 * the chain. If there are no more middleware functions left in the chain, it passes control to the
 * route handler function.
 * @returns If there is an error in validating the user parameters in the request body, a response with
 * a status code of 400 and a JSON object containing a message and the error reason will be returned.
 * Otherwise, the middleware will call the next middleware function in the chain.
 */
const userParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = userParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }

  next();
};

/**
 * This is an authentication middleware function that checks if a user is authorized to access a
 * certain resource based on their role and token.
 * @param params - The `params` parameter is an optional object that can contain a `neededRoles`
 * property, which is an array of `UserRole` values. If `neededRoles` is not provided, it defaults to
 * an empty array.
 * @returns The `authMiddleware` function returns a middleware function that takes in a request,
 * response, and next function as parameters. This middleware function checks for the presence of an
 * authorization header in the request, validates the token, and checks if the user has the necessary
 * roles or permissions to access the requested resource. If the user is authenticated and authorized,
 * the middleware sets the `req.user` property to the authenticated
 */
export const authMiddleware = (
  params: {
    neededRoles?: UserRole[];
  } = {},
): RequestHandler => {
  const neededRoles = params.neededRoles || [];

  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).json({ message: "No authorization header" });
      return;
    }

    const [type, token] = authorization.split(" ");
    if (type !== "Bearer") {
      res.status(401).json({ message: "Invalid authorization type" });
      return;
    }

    const { user, error } = await validateUserToken({ token });
    if (error) {
      res.status(401).json({ message: error });
      return;
    }

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    if (user.roles.includes(UserRole.ADMIN)) {
      req.user = user;
      next();
      return;
    }

    if (neededRoles.length > 0) {
      const hasRoles = neededRoles.every((neededRole) =>
        user.roles.includes(neededRole),
      );
      if (!hasRoles) {
        res.status(403).json({ message: "Insufficient permissions" });
        return;
      }
    }

    req.user = user;
    next();
  };
};
/* The above code is defining a route for creating a new user with specific parameters such as email,
password, name, lastName, role, mobile, urlPP200, and CUA. It includes middleware functions for
validating user parameters and checking authentication with the required role of MANAGER. If the
validation and authentication are successful, it creates a new user with the provided parameters and
returns the user object in the response. If there is an error during the user creation process, it
returns a 400 status code with an error message.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=749196783
// * M3_S03
*/
authRouter.post(
  "/create",
  userParametersMiddleware,
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const { email, password, name, lastName, role, mobile, urlPP200, CUA } =
      req.body;
    // TODO: validation

    const { user, error } = await createUser({
      email,
      password,
      name,
      lastName,
      urlPP200,
      CUA,
      roles: [role],
      mobile,
    });
    if (error) {
      res.status(400).json({ message: error });
      return;
    }

    res.json(user);
  },
);

/* The above code is defining a route for authenticating a user. It expects a POST request to the
"/authenticate" endpoint with user parameters (email and password) in the request body. It then
validates the user parameters and calls the "authenticateUser" function to authenticate the user. If
there is an error during authentication, it sends a 401 Unauthorized response with an error message.
Otherwise, it sends a JSON response with the authenticated user's information. */
authRouter.post("/authenticate", userParametersMiddleware, async (req, res) => {
  const { email, password } = req.body;
  // TODO: validation

  const { auth, error } = await authenticateUser({ email, password });
  if (error) {
    res.status(401).json({ message: error });
    return;
  }

  res.json(auth);
});

/* The above code is defining a route for the "/me" endpoint that requires authentication middleware.
It then retrieves the user's information from the database using the user ID stored in the request
object. If there is no user, it returns a 401 status code with a message. If there is a user, it
returns the user's information as a JSON object. */
authRouter.get("/me", authMiddleware(), async (req, res) => {
  const db = await getDataSource();
  if (!req.user) {
    res.status(401).json({ message: "NO USER" });
    return;
  }

  const user = await db.manager.findOne(UserEnt, {
    where: {
      id: req.user.id,
    },
  });
  res.json(user);
});

/* The above code is defining a route handler for GET requests to "/all-agents". When a request is made
to this endpoint, the code retrieves a database connection using the `getDataSource()` function, and
then queries the database to find all users with the role of "regular" using the `find()` method of
the `manager` object. The query selects specific fields from the `UserEnt` entity, including id,
email, name, lastName, CUA, and urlPP200. Finally, the code sends a JSON response containing the
results of the query to the client. */
authRouter.get(
  "/all-agents",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const db = await getDataSource();
    const sales = await db.manager.find(UserEnt, {
      where: {
        rolesString: UserRole.REGULAR,
      },
      select: ["id", "email", "name", "lastName", "CUA", "urlPP200"],
    });
    res.json(sales);
  },
);

// this is purely an example and currently serves no purpose for the app
// see tests
authRouter.get(
  "/admin",
  authMiddleware({ neededRoles: [UserRole.ADMIN] }),
  async (req, res) => {
    res.json(req.user);
  },
);

/* The above code is defining a route handler for the "/refresh" endpoint of an authentication router.
When a POST request is made to this endpoint with a refresh token and its expiration time in the
request body, the code verifies the refresh token using a helper function called "verifyToken". If
the token is valid, it retrieves the user information from a database using the user's ID stored in
the token. Then, it generates a new access token using the user's ID and sends it back in the
response along with the refresh token and user information. */
authRouter.post("/refresh", async (req, res) => {
  const { refreshToken, refreshTokenExpiresAt } = req.body;

  const { auth, error } = verifyToken(refreshToken, TokenType.RefreshToken);
  if (error) {
    res.status(401).json({ message: error.message });
    return;
  }

  const ds = await getDataSource();
  const user = await ds.manager.findOne(UserEnt, {
    where: {
      id: auth.id,
    },
    select: [
      "id",
      "email",
      "name",
      "lastName",
      "rolesString",
      "imageUrl",
      "CUA",
    ],
  });

  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const accessToken = generateToken(user.id, TokenType.AccessToken);

  res.json({
    accessToken: accessToken.token,
    accessTokenExpiresAt: accessToken.expiresAt,
    refreshToken,
    refreshTokenExpiresAt,
    username: user.email,
    name: user.name,
    lastName: user.lastName,
    roles: user.roles,
    imageUrl: user.imageUrl,
    CUA: user.CUA,
  });
});

/* The above code is defining a route for fuzzy searching users. It requires the user to have the role
of MANAGER to access the route. It then validates the query parameter using a Joi schema and returns
a 400 error if the validation fails. Finally, it calls the `fuzzySearchUsers` function with the
query parameter and returns the result as a JSON response. */
authRouter.get(
  "/fuzzy-search",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res, next) => {
    const schema = j.object({
      query: j.string().allow("").required(),
    });
    const { error } = schema.validate(req.query);
    if (error) {
      res.status(400).json({ message: "BAD_DATA", reason: error });
      return;
    }
    next();
  },
  async (req, res) => {
    const users = await fuzzySearchUsers({
      query: req.query.query as string,
    });

    res.json(users);
  },
);

/* The above code is defining a route for the "/members" endpoint using the GET method. It is using an
authentication middleware function that checks if the user making the request has the role of
"MANAGER". If the user has the required role, the route handler function is executed. The route
handler function retrieves all user roles using the "getAllUserRol" function and sends the response
as a JSON object containing the user roles.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=2023282790
// * M4_S01
*/
authRouter.get(
  "/members",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const { userRol } = await getAllUserRol();
    res.json(userRol);
  },
);

/* The above code is defining a GET endpoint for the authRouter that takes an ID parameter. It is using
an authMiddleware function to authenticate the request. Once authenticated, it connects to a
database using the getDataSource function and retrieves a user entity with the specified ID and its
associated userLinks. Finally, it sends the retrieved user entity as a JSON response. 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=718703983
// * M3_S05
*/
authRouter.get("/:id", authMiddleware(), async (req, res) => {
  const db = await getDataSource();
  const user = await db.manager.findOne(UserEnt, {
    where: { id: req.params.id },
    relations: ["userLinks"],
  });

  res.json(user);
});

/* The above code is defining a route for updating user information. It expects a POST request to
"/update/:id" with authentication middleware and a file upload. It extracts user information from
the request body and the authenticated user object. If there is no authenticated user or no
file/image uploaded, it returns an error response. Otherwise, it updates the user information with
the provided data and the uploaded image (if any) and returns the modified user object. 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=718703983
// * M3_S05
*/
authRouter.post(
  "/update/:id",
  authMiddleware(),
  upload.single("file"),
  async (req, res) => {
    const { email, name, lastName, mobile, urlPP200, CUA } = req.body;
    const { user } = req;
    if (!user) {
      res.status(401).json({ message: "NO_USER" });
      return;
    }

    const { file } = req;

    if (!file && !req.body.imageUrl) {
      res.status(400).json({ message: "NO_FILE_UPLOAD" });
      return;
    }

    const imageUrl = !!file ? await uploadFile({ file }) : req.body.imageUrl;

    const { user: modifiedUser, error } = await updateUser({
      id: req.params.id,
      email,
      name,
      lastName,
      mobile,
      urlPP200,
      CUA,
      imageUrl: imageUrl,
    });

    if (error) {
      res.status(500).json({ message: error });
      return;
    }

    res.json({ modifiedUser });
  },
);

/* The above code is defining a route for resetting a user's password. It is using the `authMiddleware`
and `resetPasswordParametersMiddleware` middleware functions to ensure that the user is
authenticated and that the request body contains the required parameters. It then extracts the
`email` and `password` from the request body and passes them to the `resetPassword` function. If
there is an error during the password reset process, it returns a 500 error response with the error
message. Otherwise, it returns a success response with a message indicating that the password was
reset successfully. */
authRouter.post(
  "/reset-password",
  authMiddleware(),
  resetPasswordParametersMiddleware,
  async (req, res) => {
    const { email, password } = req.body;
    const { error } = await resetPassword({ email, password });
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.json({ message: "Password reset successfully" });
  },
);

/* The above code is defining a route for adding a link to a user's profile. It expects a POST request
to the endpoint "/add-link/:id" with the link and name data in the request body. It also requires
authentication middleware to ensure that the user is logged in. If the user is not authenticated, it
will return a 401 error with the message "NO_USER". If the user is authenticated, it will call the
"addLink" function with the provided data and the user's ID. If there is an error, it will return a
500 error with the error message. 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=718703983
// * M3_S05
*/
authRouter.post("/add-link/:id", authMiddleware(), async (req, res) => {
  const { link, name } = req.body;

  const { user } = req;

  if (!user) {
    res.status(401).json({ message: "NO_USER" });
    return;
  }

  const { link: newLink, error } = await addLink({
    id: req.params.id,
    link,
    name,
  });

  if (error) {
    res.status(500).json({ message: error });
    return;
  }

  res.json({ newLink });
});

/* The above code is defining a route for editing a link. It expects a POST request to the "/edit-link"
endpoint with a request body containing the link, name, and id of the link to be edited. It also
requires authentication middleware to be passed before the route handler is executed. 
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=718703983
// * M3_S05
*/
authRouter.post("/edit-link", authMiddleware(), async (req, res) => {
  const { link, name, id } = req.body;

  const { user } = req;

  if (!user) {
    res.status(401).json({ message: "NO_USER" });
    return;
  }

  const { link: uLink, error } = await updateLink({
    id,
    link,
    name,
  });

  if (error) {
    res.status(500).json({ message: error });
    return;
  }

  res.json({ uLink });
});

/* The above code is defining a route for deleting a user link. It first checks if there is a user
authenticated using the `authMiddleware()` function. If there is no authenticated user, it returns a
401 status code with a "NO_USER" message. If there is an authenticated user, it gets a connection to
the database using the `getDataSource()` function and deletes the user link with the specified ID
from the `UserLinkEnt` entity using the `delete()` method of the repository. If there is an error
during the deletion process, it returns a 500 status code with the error */
authRouter.delete("/delete-link", authMiddleware(), async (req, res) => {
  const { user } = req;

  if (!user) {
    res.status(401).json({ message: "NO_USER" });
    return;
  }

  const db = await getDataSource();
  const links = await db.manager
    .getRepository(UserLinkEnt)
    .delete(req.body.id)
    .catch((err) => {
      res.status(500).json({ message: err });
      return;
    });

  res.json({ links });
});

/* The above code is defining a GET endpoint for retrieving user links for a specific user ID. It first
checks if there is a user authenticated using the `authMiddleware()` function. If there is no
authenticated user, it returns a 401 status code with a "NO_USER" message. If there is an
authenticated user, it retrieves the user links from the database using the `getDataSource()`
function and the `UserLinkEnt` entity, filtering by the user ID specified in the request parameters.
Finally, it returns the retrieved links in a JSON response. */
authRouter.get("/links/:id", authMiddleware(), async (req, res) => {
  const { user } = req;

  if (!user) {
    res.status(401).json({ message: "NO_USER" });
    return;
  }

  const db = await getDataSource();
  const links = await db.manager.find(UserLinkEnt, {
    where: { userId: req.params.id },
  });

  res.json({ links });
});

/* The above code is defining a route for retrieving links associated with a user's email address. It
first checks if there is a user authenticated using the `authMiddleware()` function. If there is no
authenticated user, it returns a 401 unauthorized response. If there is an authenticated user, it
retrieves the user's information from the database using their email address. If the user is not
found in the database, it returns a 401 unauthorized response. If the user is found, it retrieves
all links associated with the user's ID from the `UserLinkEnt` table in the database and returns
them in */
authRouter.get("/my-links/:email", authMiddleware(), async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "NO USER" });
    return;
  }

  const db = await getDataSource();
  const FindUser = await db.manager.findOne(UserEnt, {
    where: { email: req.user.email },
  });

  if (!FindUser) {
    res.status(401).json({ message: "NO USER" });
    return;
  }

  const links = await db.manager.find(UserLinkEnt, {
    where: { userId: FindUser.id },
  });

  res.json({ links });
});
