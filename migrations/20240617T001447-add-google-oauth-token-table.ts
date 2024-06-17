import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("google_oauth_tokens")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("token", "jsonb")
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("expiry_date", "timestamp")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("google_oauth_tokens").execute();
}
