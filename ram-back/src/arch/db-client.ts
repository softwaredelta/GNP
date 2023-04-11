// (c) Delta Software 2023, rights reserved.
/**
 * This file abstracts the database connection setup away from functional code.
 */

import { DataSource } from "typeorm";

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource) {
    return dataSource;
  }

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "remote") {
    // local and remote architectures use PG env variables directly
    dataSource = new DataSource({
      type: "postgres",
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || "5432"),
      database: process.env.PGDATABASE,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    });

    await dataSource
      .initialize()
      .then(() => console.info("Using local/remote DataSource connection"));

    return dataSource;
  }

  if (process.env.NODE_ENV === "aws") {
    // AWS uses the RDS instance
    dataSource = new DataSource({
      type: "postgres",
      host: process.env.RDS_HOSTNAME,
      port: parseInt(process.env.RDS_PORT || "5432"),
      database: process.env.RDS_DB_NAME,
      username: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await dataSource
      .initialize()
      .then(() => console.info("Using AWS DataSource connection"));

    return dataSource;
  }

  throw new Error("Unknown environment");
}
