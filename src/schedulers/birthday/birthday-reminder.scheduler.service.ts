import { Inject, Injectable, Logger } from "@nestjs/common";
import { EXPO_PROVIDER_KEY } from "src/common/providers/expo.provider";
import Expo from "expo-server-sdk";
import { OPENAI_PROVIDER_KEY } from "src/common/providers/openai.provider";
import { OpenAI } from "openai";
import { GoogleOauthClientService } from "src/common/services/google-oauth-client.service";
import { Contact, ContactsService } from "src/common/services/contacts.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { DATABASE_PROVIDER_KEY } from "src/common/providers/database.provider";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { env } from "src/helpers/env";
import { api } from "src/api";
import { splitDate } from "src/utils";
import { CronJob } from "src/common/decorators/cron.decorator";

type Event = Contact & { inDays: number };

@Injectable()
export class BirthdayReminderSchedulerService {
  private readonly logger = new Logger(BirthdayReminderSchedulerService.name);
  private readonly daysBefore = [7, 3, 0];

  constructor(
    @Inject(EXPO_PROVIDER_KEY) private readonly expo: Expo,
    @Inject(OPENAI_PROVIDER_KEY) private readonly openai: OpenAI,
    @Inject(DATABASE_PROVIDER_KEY) private readonly db: Kysely<DB>,
    private readonly oauth: GoogleOauthClientService,
    private readonly contacts: ContactsService,
  ) {}

  @CronJob(CronExpression.EVERY_DAY_AT_NOON)
  async scheduleBirthdayReminder() {
    const oauthClient = await this.oauth.getOAuthClient();
    const contacts = await this.contacts.retrieveContacts(oauthClient);
    this.logger.log(`Contacts retrieved | count: ${contacts?.length}`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { namedays, birthdays } = await this.getContactEvents(today, contacts);

    this.logger.log("namedays: ", namedays);
    this.logger.log("birthdays: ", birthdays);

    await this.sendNamedayNotifications(namedays, today);
    await this.sendBirthdayNotifications(birthdays, today);
  }

  private async getContactEvents(
    today: Date,
    contacts: Contact[],
  ): Promise<{
    namedays: Event[];
    birthdays: Event[];
  }> {
    let namedays: Event[] = [];
    let birthdays: Event[] = [];

    for (const inDays of this.daysBefore) {
      const date = new Date(today);
      date.setDate(today.getDate() + inDays);
      const nameday = await api.getNameDay(date);

      // prettier-ignore
      const foundNamedays = this.contacts.filterContactsWithNameday(contacts, nameday.names);
      const foundBirthdays = this.contacts.filterContactsWithBirthday(contacts, date);

      namedays = namedays.concat(
        foundNamedays.map((nameday) => ({ ...nameday, inDays })),
      );
      birthdays = birthdays.concat(
        foundBirthdays.map((birthday) => ({ ...birthday, inDays })),
      );
    }

    return { namedays, birthdays };
  }

  private async sendNamedayNotifications(namedays: Event[], today: Date) {
    for (const nameday of namedays) {
      this.logger.log(`Sending nameday notification: ${JSON.stringify(nameday)}`);
      await this.expo.sendPushNotificationsAsync([
        {
          to: env.EXPO_PUSH_TOKEN,
          title: `${nameday.name} has a name day (svátek) in ${nameday.inDays} days!`,
          priority: "high",
        },
      ]);
    }
  }

  private async sendBirthdayNotifications(birthdays: Event[], today: Date) {
    for (const birthday of birthdays) {
      this.logger.log(`Sending birthday notification: ${JSON.stringify(birthday)}`);
      const todaySplit = splitDate(today);
      const birthdaySplit = this.contacts.parseContactBirthday(birthday);
      const yearDiff = todaySplit[0] - birthdaySplit[0];
      this.logger.log("age: ", yearDiff);

      await this.expo.sendPushNotificationsAsync([
        {
          to: env.EXPO_PUSH_TOKEN,
          title: `${birthday.name} has a birthday in ${birthday.inDays} days!`,
          subtitle: yearDiff > 0 ? `Turning ${yearDiff} years old` : undefined,
          body: yearDiff > 0 ? `Turning ${yearDiff} years old` : undefined,
          priority: "high",
        },
      ]);
    }
  }
}
