import { Provider } from "@nestjs/common";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DB } from "kysely-codegen";
import { env } from "../common/env";
import { kyselyDialect } from "../common/kysely-dialect";

export const DatabaseProvider: Provider = {
  provide: "Database",
  useFactory: () => {
    return new Kysely<DB>({
      dialect: kyselyDialect,
    });
  },
};
