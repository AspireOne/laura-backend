import axios from "../helpers/axios";
import { constants } from "../helpers/constants";
import { z } from "zod";

const MonthSchema = z.object({
  nominative: z.string(),
  genitive: z.string(),
});

const NameDayInfoSchema = z.object({
  date: z.string().describe("Example: 2024-06-17"),
  dayNumber: z.string().describe("Example: 17"),
  dayInWeek: z.string().describe("Example: pondělí"),
  monthNumber: z.string().describe("Example: 6"),
  month: MonthSchema.describe("Month object containing nominative and genitive forms"),
  year: z.string().describe("Example: 2024"),
  name: z.string().describe("This is the person's name, e.g., Adolf"),
  isHoliday: z.boolean(),
  holidayName: z
    .string()
    .nullable()
    .describe("Name of the holiday if it is a holiday, otherwise null"),
});

export type NameDayInfo = z.infer<typeof NameDayInfoSchema>;

export async function getNameDay(date?: Date): Promise<NameDayInfo> {
  const dateFormatted = date?.toISOString()?.split("T")?.[0];
  const res = await axios.get(`${constants.nameDayApiUrl}/${dateFormatted}`);
  const parsedData = NameDayInfoSchema.parse(res.data);
  return parsedData;
}
