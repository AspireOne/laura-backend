import { Inject, Injectable, Logger } from "@nestjs/common";
import { EXPO_PROVIDER_KEY } from "../common/providers/expo.provider";
import Expo from "expo-server-sdk";
import { OPENAI_PROVIDER_KEY } from "../common/providers/openai.provider";
import { OpenAI } from "openai";
import { GoogleOauthClientService } from "../common/services/google-oauth-client.service";
import { Contact, ContactsService } from "../common/services/contacts.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { api } from "../api";
import { DATABASE_PROVIDER_KEY } from "../common/providers/database.provider";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { env } from "../helpers/env";
import { replaceDiacritics } from "../utils";
import { SchedulerErrorHandlerService } from "../common/services/scheduler-error-handler.service";

@Injectable()
export class BirthdayReminderService {
  private readonly logger = new Logger(BirthdayReminderService.name);
  private readonly today: Date;
  private readonly checkDate: Date;

  constructor(
    @Inject(EXPO_PROVIDER_KEY) private readonly expo: Expo,
    @Inject(OPENAI_PROVIDER_KEY) private readonly openai: OpenAI,
    @Inject(DATABASE_PROVIDER_KEY) private readonly db: Kysely<DB>,
    private readonly errorHandler: SchedulerErrorHandlerService,
    private readonly oauth: GoogleOauthClientService,
    private readonly contacts: ContactsService,
  ) {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

    this.checkDate = new Date();
    this.checkDate.setHours(0, 0, 0, 0);
    this.checkDate.setDate(this.checkDate.getDate() + 7);
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async handleCron() {
    this.logger.log("handleCron started");
    await this.errorHandler.notifyOnError(this.execute, BirthdayReminderService.name);
  }

  async execute() {
    const oauthClient = await this.oauth.getOAuthClient();
    this.logger.log("OAuth client obtained");
    const contacts = await this.contacts.retrieveContacts(oauthClient);
    this.logger.log("Contacts retrieved");

    this.logger.log("contacts: ", contacts);

    // format as dd mm yyyy
    this.logger.log("checkDate: ", this.checkDate.toISOString().split("T")[0]);

    const namedays = await this.getContactsWithNameday(this.checkDate, contacts);
    const birthdays = await this.getContactsWithBirthday(this.checkDate, contacts);

    await this.addDayToDb(this.checkDate, "nameday", namedays);
    await this.addDayToDb(this.checkDate, "birthday", birthdays);

    await this.sendNotifications(this.today);
  }

  async sendNotifications(today: Date) {
    const events = await this.db
      .selectFrom("events")
      .select(["id", "event_type", "event_name", "event_date"])
      .where("event_type", "in", ["nameday", "birthday"])
      .execute();

    for (const event of events) {
      this.logger.log(
        "Checking whether to send notification to event ",
        JSON.stringify(event),
      );
      event.event_date.setHours(0, 0, 0, 0);

      const diffInDays = Math.round(
        (event.event_date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      this.logger.log("difference (days) between today and event date: ", diffInDays);

      if ([0, 3, 7].includes(diffInDays)) {
        await this.expo.sendPushNotificationsAsync([
          {
            to: env.EXPO_PUSH_TOKEN,
            title: event.event_name,
            data: event,
            priority: "high",
          },
        ]);
      }
    }
  }

  async addDayToDb(date: Date, type: "birthday" | "nameday", contacts: Contact[]) {
    for (const person of contacts) {
      await this.db
        .insertInto("events")
        .values({
          event_type: type,
          event_name: `${person.name} has ${type} in a week!`,
          event_date: date,
        })
        .onConflict((oc) => oc.doNothing())
        .execute();
    }
  }

  async getContactsWithBirthday(date: Date, contacts: Contact[]): Promise<Contact[]> {
    const dateFormatted = date.toISOString().split("T")[0];
    const [year, month, day] = dateFormatted.split("-");

    return contacts.filter((contact) => {
      const [contactYear, contactMonth, contactDay] = contact.birthday.split("-");

      this.logger.log(
        "checking ",
        `${year}-${month}-${day}`,
        " against ",
        `${contactYear}-${contactMonth}-${contactDay}`,
      );

      // Check if the month and day match
      return contactMonth === month && contactDay === day;
    });
  }

  async getContactsWithNameday(date: Date, contacts: Contact[]): Promise<Contact[]> {
    const nemadayData = await api.getNameDay(date);
    this.logger.log("data from nameday api: ", nemadayData);
    return contacts.filter((contact) => {
      const contactName = replaceDiacritics(contact.name).toLowerCase();
      const nameday = replaceDiacritics(nemadayData.name).toLowerCase();
      const regex = new RegExp(`\\b${contactName}\\b`, "i");

      console.log("checking", nameday, " against ", contactName);
      return regex.test(contactName);
    });
  }
}
