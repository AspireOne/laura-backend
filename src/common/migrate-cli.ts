import * as path from "path";
import { promises as fs } from "fs";
import { Kysely, Migrator, FileMigrationProvider } from "kysely";
import { run } from "kysely-migration-cli";
import { DB } from "kysely-codegen";
import { kyselyDialect } from "./kysely-dialect";
import * as dotenv from "dotenv";

dotenv.config();

const projectRootDir = path.resolve(__dirname, "..", "..");
const migrationsDirPath = path.join(projectRootDir, "migrations");

const db = new Kysely<DB>({
  dialect: kyselyDialect,
});

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: migrationsDirPath,
  }),
});

run(db, migrator, migrationsDirPath);
