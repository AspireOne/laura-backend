import { Injectable } from "@nestjs/common";
import { Contact, ContactsService } from "src/common/services/contacts.service";
import { api } from "src/api";
import { GoogleOauthClientService } from "src/common/services/google-oauth-client.service";
import { GetCelebrationsDto } from "src/routes/celebrations/dto/get-celebrations.dto";

type GetUpcomingWeekNamedays = {
  names: string[];
  inDays: number;
}[];

@Injectable()
export class CelebrationsService {
  private readonly days = [0, 1, 2, 3, 4, 5, 6, 7];

  constructor(
    private readonly contactsService: ContactsService,
    private readonly oauth: GoogleOauthClientService,
  ) {}

  async findAll(today: Date): Promise<GetCelebrationsDto[]> {
    const oauth = await this.oauth.getOAuthClient();
    const contacts = await this.contactsService.retrieveContacts(oauth);

    const namedayContacts = await this.findNamedays(today, contacts);
    const birthdayContacts = await this.findBirthdays(today, contacts);

    return this.days.map((day) => {
      const nameday = namedayContacts.find((n) => n.inDays === day);
      const birthday = birthdayContacts.find((b) => b.inDays === day);

      return {
        namedayContacts: nameday.contacts,
        birthdayContacts: birthday.contacts,
        inDays: day,
      };
    });
  }

  async findNamedays(today: Date, contacts: Contact[]) {
    const upcomingWeekNamedays = await this.getUpcomingWeekNamedays(today);

    return upcomingWeekNamedays.map((nameday) => {
      const contactsWithNameday = this.contactsService.filterContactsWithNameday(
        contacts,
        nameday.names,
      );

      return {
        contacts: contactsWithNameday,
        inDays: nameday.inDays,
      };
    });
  }

  async findBirthdays(today: Date, contacts: Contact[]) {
    const birthdays: {
      contacts: Contact[];
      inDays: number;
    }[] = [];

    for (const day of this.days) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + day);

      const contactsWithBirthday = this.contactsService.filterContactsWithBirthday(
        contacts,
        targetDate,
      );

      birthdays.push({
        contacts: contactsWithBirthday,
        inDays: day,
      });
    }

    return birthdays;
  }

  async getUpcomingWeekNamedays(today: Date): Promise<GetUpcomingWeekNamedays> {
    const names: GetUpcomingWeekNamedays = [];

    for (const day of this.days) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + day);
      const nameday = await api.getNameDay(targetDate);

      names.push({
        names: nameday.names,
        inDays: day,
      });
    }

    return names;
  }
}
