import { Inject, Injectable, Logger } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { people, people_v1 } from "@googleapis/people";
import { replaceDiacritics } from "src/utils";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

const interchangeableNameday = Object.freeze([
  ["norbert", "bert", "bertik"],
  ["honza", "jan"],
  ["jaroslav", "jarek"],
  ["sylva", "alan"],
  ["terka", "tereza"],
  ["karolina", "kaja"],
  ["barbora", "bara"],
  ["nelca", "nela", "nelunka"],
  ["jiri", "jirka"],
  ["josef", "jozka", "pepa"],
  ["vaclav", "vasek"],
  ["jaroslav", "jarda", "jarek"],
  ["zdenek", "zdena", "zdenka"],
  ["vojtech", "vojta"],
  ["ladislav", "lada"],
  ["miroslav", "mirek"],
  ["stanislav", "standa"],
  ["vladimir", "vlada"],
  ["frantisek", "franta"],
  ["bohumil", "bohous", "bob"],
  ["bedrich", "beda"],
  ["oldrich", "olda"],
  ["antonin", "tonda"],
  ["zbynek", "zbysek"],
  ["bohuslav", "slavek"],
  ["alois", "lojza"],
  ["radek", "radoslav"],
  ["lubomir", "lubos"],
  ["cestmir", "cesta"],
  ["miloslav", "milos"],
  ["premysl", "premek"],
  ["svatopluk", "svata"],
]);

export type Contact = {
  name: string;
  birthday: string;
  email: string;
  phone: string;
};

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async retrieveContacts(authClient: OAuth2Client): Promise<Contact[]> {
    const cacheKey = `google_contacts_${authClient.credentials.access_token}`;

    const cachedContacts = await this.cache.get<Contact[]>(cacheKey);
    if (cachedContacts) {
      this.logger.debug("Returning contacts from cache");
      return cachedContacts;
    }

    const service: people_v1.People = people({ version: "v1", auth: authClient });

    const res = await service.people.connections.list({
      resourceName: "people/me",
      pageSize: 1000,
      personFields: "names,birthdays,emailAddresses,phoneNumbers",
    });

    const contacts = res.data.connections || [];
    const formattedContacts = contacts.map(this.formatConnection);

    // Cache the contacts for 1 hour (3600 seconds)
    await this.cache.set(cacheKey, formattedContacts, 3600000);

    return formattedContacts;
  }

  private formatConnection(connection: people_v1.Schema$Person): Contact {
    const names =
      connection.names?.map((name) => name.displayName).join(", ") || "No Name";

    const birthdays =
      connection.birthdays
        ?.map((b) => `${b.date?.year}-${b.date?.month}-${b.date?.day}`)
        .join(", ") || "No Birthday";

    const emails =
      connection.emailAddresses?.map((email) => email.value).join(", ") || "No Email";

    const phones =
      connection.phoneNumbers?.map((phone) => phone.value).join(", ") || "No Phone";

    return { name: names, birthday: birthdays, email: emails, phone: phones };
  }

  /**
   * This method is used to get contacts with specific namedays.
   * It takes an array of contacts and an array of nameday names as input.
   * It returns an array of contacts that have any of the namedays (matching names).
   */
  public filterContactsWithNameday(
    contacts: Contact[],
    namedayNames: string[],
  ): Contact[] {
    const normalizeAndTrim = (name: string) =>
      replaceDiacritics(name).trim().toLowerCase();
    const namedaysNormalized = new Set(namedayNames.map(normalizeAndTrim));

    return contacts.filter((contact) => {
      const firstName = contact.name?.split(" ")[0] ?? contact.name;
      const normalizedName = normalizeAndTrim(firstName);

      const possibleNames = interchangeableNameday.find((names) =>
        names.includes(normalizedName),
      ) ?? [normalizedName];

      return possibleNames.some((name) => {
        const isMatch = namedaysNormalized.has(name);
        this.logger.log(`Svátek ${name} | ${[...namedaysNormalized]} = ${isMatch}`);
        return isMatch;
      });
    });
  }

  public filterContactsWithBirthday(contacts: Contact[], date: Date): Contact[] {
    const dateFormatted = date.toISOString().split("T")[0];
    const [, _month, _day] = dateFormatted.split("-");

    // Normalize the month and day to be 2 digits (e.g. 6 -> 06)
    const month = parseInt(_month, 10).toString();
    const day = parseInt(_day, 10).toString();

    this.logger.log(`The target birthday date: ${month}-${day}`);

    return contacts.filter((contact) => {
      const [, _contactMonth, _contactDay] = contact.birthday.split("-");
      // Normalize the month and day to be 2 digits (e.g. 6 -> 06)
      const contactMonth = parseInt(_contactMonth, 10).toString();
      const contactDay = parseInt(_contactDay, 10).toString();

      // if one is not a number, return false
      if (isNaN(parseInt(contactMonth, 10)) || isNaN(parseInt(contactDay, 10))) {
        return false;
      }

      this.logger.log(
        `Checking ${month}-${day} (target) against ${contactMonth}-${contactDay} (contact)`,
      );

      // Check if the month and day match
      const hasBday = contactMonth === month && contactDay === day;
      if (hasBday) this.logger.log(`Bday found: ${contact.name}`);
      return hasBday;
    });
  }

  /**
   * This method is used to parse the birthday of a contact.
   *
   * It takes a contact object as input and returns an array of numbers [year, month, day].
   *
   * The birthday is expected to be in the format "YYYY-MM-DD".
   *
   * Any part of the birthday can be missing. Example: if every part is missing, it will return [NaN, NaN, NaN].
   * @param contact
   */
  public parseContactBirthday(contact: Contact): [number, number, number] {
    // In case it has multiple birthdays, take the first one.
    const birthday = contact.birthday?.split(",")?.[0]?.trim();
    const [_year, _month, _day] = birthday?.split("-");
    const year = parseInt(_year, 10);
    const month = parseInt(_month, 10);
    const day = parseInt(_day, 10);

    return [year, month, day];
  }
}
