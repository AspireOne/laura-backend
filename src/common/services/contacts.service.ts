import { Inject, Injectable, Logger } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { people, people_v1 } from "@googleapis/people";
import { GoogleOauthTokenManagementService } from "./google-oauth-token-management.service";

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  constructor() {}

  async retrieveContacts(authClient: OAuth2Client): Promise<any> {
    const service: people_v1.People = people({ version: "v1", auth: authClient });

    const res = await service.people.connections.list({
      resourceName: "people/me",
      pageSize: 1000,
      personFields: "names,birthdays,emailAddresses,phoneNumbers",
    });

    const connections = res.data.connections;
    return !connections ? [] : connections.map(this.formatConnection);
  }

  formatConnection(connection: people_v1.Schema$Person): any {
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

    return { names, birthdays, emails, phones };
  }
}
