import { Inject, Injectable, Logger } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { people, people_v1 } from "@googleapis/people";

export type Contact = {
  name: string;
  birthday: string;
  email: string;
  phone: string;
};

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  constructor() {}

  async retrieveContacts(authClient: OAuth2Client): Promise<Contact[]> {
    const service: people_v1.People = people({ version: "v1", auth: authClient });

    const res = await service.people.connections.list({
      resourceName: "people/me",
      pageSize: 1000,
      personFields: "names,birthdays,emailAddresses,phoneNumbers",
    });

    const connections = res.data.connections || [];
    return connections.map(this.formatConnection);
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
}
