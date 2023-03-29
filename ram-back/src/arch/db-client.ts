// (c) Delta Software 2023, rights reserved.
/**
 * This file abstracts the database connection setup away from functional code.
 */

import { Client } from "pg";

export function getDbClient(): Client {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "remote") {
    // local and remote architectures use PG env variables directly
    return new Client();
  }

  if (process.env.NODE_ENV === "aws") {
    // AWS uses the RDS instance
    return new Client({
      host: process.env.RDS_HOSTNAME,
      port: parseInt(process.env.RDS_PORT || "5432"),
      database: process.env.RDS_DB_NAME,
      user: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  throw new Error("Unknown environment");
}
