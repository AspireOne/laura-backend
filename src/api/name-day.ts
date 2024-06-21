import axios from "../helpers/axios";
import { constants } from "../helpers/constants";
import { z } from "zod";

const MonthSchema = z.object({
  nominative: z.string(),
  genitive: z.string(),
});

const namedayApiResponseSchema = z.object({
  date: z.string().describe("Example: 2024-06-17"),
  dayNumber: z.string().describe("Example: 17"),
  dayInWeek: z.string().describe("Example: pondělí"),
  monthNumber: z.string().describe("Example: 6"),
  month: MonthSchema.describe("Month object containing nominative and genitive forms"),
  year: z.string().describe("Example: 2024"),
  name: z
    // string array
    .string()
    .min(1, { message: "Name must be at least 1 character long" })
    .describe("This is the person's name, e.g., 'Adolf', or 'Helena a Marek'"),
  isHoliday: z.boolean(),
  holidayName: z
    .string()
    .nullable()
    .describe("Name of the holiday if it is a holiday, otherwise null"),
});

export type NamedayApiResponse = z.infer<typeof namedayApiResponseSchema>;
export type NamedayReturns = Omit<NamedayApiResponse, "name"> & {
  names: string[];
};

const cache: { [key: string]: NamedayReturns } = {};

export async function getNameDay(date: Date): Promise<NamedayReturns> {
  const dateFormatted = date.toISOString().split("T")[0];

  // Check if data is in cache
  if (cache[dateFormatted]) {
    return cache[dateFormatted];
  }

  // Fetch data from API
  const res = await axios.get(`${constants.nameDayApiUrl}/${dateFormatted}`);
  const parsedData = namedayApiResponseSchema.parse(res.data);

  const formattedNames = parsedData.name.split(" a ");
  const parsedDataWithNames = { ...parsedData, names: formattedNames };

  cache[dateFormatted] = parsedDataWithNames;
  
  return parsedDataWithNames;
}
