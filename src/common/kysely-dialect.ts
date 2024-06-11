import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["DATABASE_URL"];

// Iterate the env vars and throw an error if any are missing
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(
      `Missing env var: ${envVar}, can not initialize the database connection`,
    );
  }
});

export const kyselyDialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
});
