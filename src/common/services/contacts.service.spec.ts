import { api } from "src/api";
import { Logger } from "@nestjs/common";
import { Contact, ContactsService } from "src/common/services/contacts.service";

// prettier-ignore
const mockContacts: Contact[] = [
  {
    name: "Milan Novák",
    birthday: "No birthday-undefined-undefined",
    email: "jan@seznam.cz",
    phone: "+420 123 456 789",
  },
  {
    name: "Milana Svobodová",
    birthday: "undefined-undefined-undefined",
    email: "jana@gmail.com",
    phone: "420987654321",
  },
  { name: "mílan Černý", birthday: "2008-02-04", email: "petr@seznam.cz", phone: "+420 111 222 333" },
  { name: "Milanius Dvořák", birthday: "undefined-06-03", email: "karel@gmail.com", phone: "777 888 999" },
  { name: "Marie Veselá", birthday: "2004-06-03", email: "marie@seznam.cz", phone: "+420 333 444 555" },
  { name: "Lucie Králová", birthday: "2003-06-03", email: "lucie@gmail.com", phone: "420666777888" },
  { name: "Matěj Pešl", birthday: "2004-12-6", email: "matejpesl1@gmail.com", phone: "+420 732 175 490" },
];

// Mock the api.getNameDay function
jest.mock("../../api", () => ({
  api: {
    getNameDay: jest.fn(),
  },
}));

describe("BirthdayReminderSchedulerService", () => {
  let service: ContactsService;

  beforeEach(() => {
    service = new ContactsService();
  });

  it("should filter contacts with matching nameday", () => {
    const mockDate = new Date("2024-12-06");
    const mockNamedayData = { name: "Milan" };

    // Mock the response from the nameday API
    (api.getNameDay as jest.Mock).mockResolvedValue(mockNamedayData);

    // prettier-ignore
    const expectedContacts: Contact[] = [
      mockContacts[0],
      mockContacts[2],
    ];

    const result = service.filterContactsWithNameday(mockContacts, [mockNamedayData.name]);
    expect(result).toEqual(expectedContacts);
  });

  it("should filter contacts with matching birthday", () => {
    const mockDate = new Date("2024-06-03");

    // prettier-ignore
    const expectedContacts: Contact[] = [
      mockContacts[3],
      mockContacts[4],
      mockContacts[5],
    ];

    const result = service.filterContactsWithBirthday(mockContacts, mockDate);
    expect(result).toEqual(expectedContacts);
  });

  it("Should return one contact", () => {
    const mockDate = new Date("2024-12-06");

    // prettier-ignore
    const expectedContacts: Contact[] = [
      { name: "Matěj Pešl", birthday: "2004-12-6", email: "matejpesl1@gmail.com", phone: "+420 732 175 490" },
    ];

    const result = service.filterContactsWithBirthday(mockContacts, mockDate);
    expect(result).toEqual(expectedContacts);
  });

  it("Should parse birthdays properly", async () => {
    const baseContact: Contact = {
      name: "Matěj Pešl",
      birthday: "2004-12-6",
      email: "matejpesl1@gmail.com",
      phone: "+420 732 175 490",
    };

    const birthdays: [string, number[]][] = [
      ["2004-12-6", [2004, 12, 6]],
      ["undefined-undefined-undefined", [NaN, NaN, NaN]],
      ["2008-02-04", [2008, 2, 4]],
      ["2001-undefined-04", [2001, NaN, 4]],
      ["No Birthday-undefined-4", [NaN, NaN, 4]],
    ];

    for (const birthday of birthdays) {
      const parsed = service.parseContactBirthday({
        ...baseContact,
        birthday: birthday[0],
      });

      expect(parsed).toEqual(birthday[1]);
    }
  });
});
