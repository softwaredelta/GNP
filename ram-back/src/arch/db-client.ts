// (c) Delta Software 2023, rights reserved.
/**
 * This file abstracts the database connection setup away from functional code.
 */

import { DataSource } from "typeorm";
import { UserEnt } from "../entities/user.entity";
import { loadSeeds } from "../seeds";

let dataSource: DataSource | null = null;
const entities = [UserEnt];

export async function getDataSource(): Promise<DataSource> {
  if (dataSource) {
    return dataSource;
  }

  if (process.env.NODE_ENV === "remote") {
    // remote architectures use PG env variables directly over docker
    dataSource = new DataSource({
      type: "postgres",
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || "5432"),
      database: process.env.PGDATABASE,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      entities,
    });

    await dataSource
      .initialize()
      .then(() => console.info("Using remote docker DataSource connection"));

    console.warn(
      "This is a staging environment, forcing a database sync (docker)",
    );
    await dataSource.synchronize(true);

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
