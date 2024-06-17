import axios from "../helpers/axios";
import { constants } from "../helpers/constants";

type Month = {
  nominative: string;
  genitive: string;
};

type NameDayInfo = {
  date: string; // For example: "2024-06-17"
  dayNumber: string; // For example: "17"
  dayInWeek: string; // For example: "pondělí"
  monthNumber: string; // For example: "6"
  month: Month;
  year: string; // For example: "2024"
  /** This is the person's name */
  name: string; // For example: "Adolf"
  isHoliday: boolean;
  holidayName: string | null;
};

export async function getNameDay(date?: Date): Promise<NameDayInfo> {
  const dateFormatted = date?.toISOString()?.split("T")?.[0];
  const res = await axios.get<NameDayInfo>(`${constants.nameDayApiUrl}/${dateFormatted}`);
  return res.data;
}
