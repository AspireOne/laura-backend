import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("events")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("event_type", "text", (col) => col.notNull())
    .addColumn("event_name", "text", (col) => col.notNull())
    .addColumn("event_date", "date", (col) => col.notNull())
    .addColumn("notification_7_days", "boolean", (col) => col.defaultTo(false))
    .addColumn("notification_3_days", "boolean", (col) => col.defaultTo(false))
    .addColumn("notification_on_day", "boolean", (col) => col.defaultTo(false))
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("expires_at", "timestamp")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("events").execute();
}
