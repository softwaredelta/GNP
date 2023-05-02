// (c) Delta Software 2023, rights reserved.
/**
 * This file abstracts the database connection setup away from functional code.
 */

import { DataSource } from "typeorm";
import { loadSeeds } from "../seeds";
import { entities } from "../entities";

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource) {
    return dataSource;
  }

  if (process.env.NODE_ENV === "fly") {
    // fly.io uses a sqlite file database
    dataSource = new DataSource({
      type: "sqlite",
      database: "/data/db.sqlite3",
      dropSchema: false,
      entities,
    });

    await dataSource.initialize();

    await dataSource.synchronize(false);

    console.warn("Loading seeds for staging environment...");
    await loadSeeds();

    return dataSource;
  }

  if (process.env.NODE_ENV === "test" || !process.env.NODE_ENV) {
    // test and local uses a local in-memory database
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities,
    });

    await dataSource.initialize();

    await dataSource.synchronize(true);

    if (!process.env.NODE_ENV) {
      // on local development we want to initialize the database with some data
      console.warn("Loading seeds for local development...");
      await loadSeeds();
    }

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
      entities,
    });

    await dataSource
      .initialize()
      .then(() => console.info("Using AWS DataSource connection"));

    return dataSource;
  }

  throw new Error("Unknown environment");
}
