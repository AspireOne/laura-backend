import { OAuth2Client } from "google-auth-library";
import { people_v1, people } from "@googleapis/people";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import "dotenv/config";

type Credentials = {
  web: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
};

const SCOPES = ["https://www.googleapis.com/auth/contacts.readonly"];
const TOKEN_PATH = path.join(__dirname, "token.json");

const rawCredentials = process.env.GOOGLE_API_CREDENTIALS;

if (!rawCredentials) {
  throw new Error("CREDENTIALS environment variable is not set");
}

let CREDENTIALS: Credentials;

try {
  CREDENTIALS = JSON.parse(rawCredentials);
  console.log(CREDENTIALS);
} catch (error) {
  console.error("Failed to parse CREDENTIALS:", error);
}

const loadCredentials = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    resolve(CREDENTIALS);
  });
};

const authorize = async (credentials: any): Promise<OAuth2Client> => {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  return new Promise((resolve, reject) => {
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client).then(resolve).catch(reject);
      oAuth2Client.setCredentials(JSON.parse(token.toString()));
      resolve(oAuth2Client);
    });
  });
};

const getNewToken = (oAuth2Client: OAuth2Client): Promise<OAuth2Client> => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);

  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", (code: string) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return reject("Error retrieving access token");
        oAuth2Client.setCredentials(token!);

        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return reject(err);
          console.log("Token stored to", TOKEN_PATH);
        });
        resolve(oAuth2Client);
      });
    });
  });
};

const listContacts = async (auth: OAuth2Client) => {
  const service: people_v1.People = people({ version: "v1", auth });

  try {
    const res = await service.people.connections.list({
      resourceName: "people/me",
      pageSize: 1000,
      personFields: "names,birthdays,emailAddresses,phoneNumbers",
    });

    const connections = res.data.connections;
    if (connections) {
      connections.forEach((person) => {
        const names = person.names;
        if (names && names.length > 0) {
          console.log(`Name: ${names[0].displayName}`);
        }

        const birthdays = person.birthdays;
        if (birthdays && birthdays.length > 0) {
          const birthday = birthdays[0].date;
          console.log(
            `Birthday: ${birthday ? `${birthday.year}-${birthday.month}-${birthday.day}` : ""}`,
          );
        }

        const emailAddresses = person.emailAddresses;
        if (emailAddresses && emailAddresses.length > 0) {
          emailAddresses.forEach((email) => {
            console.log(`Email: ${email.value}`);
          });
        }

        const phoneNumbers = person.phoneNumbers;
        if (phoneNumbers && phoneNumbers.length > 0) {
          phoneNumbers.forEach((phone) => {
            console.log(`Phone: ${phone.value}`);
          });
        }

        console.log("-----------------------------");
      });
    } else {
      console.log("No connections found.");
    }
  } catch (err) {
    console.error("The API returned an error: " + err);
  }
};

const main = async () => {
  try {
    const credentials = await loadCredentials();
    const auth = await authorize(credentials);
    await listContacts(auth);
  } catch (error) {
    console.error("Error:", error);
  }
};

main();
