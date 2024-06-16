import { Provider } from "@nestjs/common";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { kyselyDialect } from "../../helpers/kysely-dialect";

export const DATABASE_PROVIDER_KEY = "Database";
export const DatabaseProvider: Provider = {
  provide: DATABASE_PROVIDER_KEY,
  useFactory: () => {
    return new Kysely<DB>({
      dialect: kyselyDialect,
    });
  },
};
