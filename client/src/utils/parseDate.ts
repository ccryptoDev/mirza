import moment from "moment";
// parse input date in format 11122020 to format 11/12/2000
export const parseDate = (date: string) => {
  if (date) {
    const newDate = date.replace("/", "").trim();
    const month = newDate.slice(0, 2);
    const day = newDate.slice(2, 4);
    const year = newDate.slice(4, 8);
    return `${month}/${day}/${year}`;
  }
  return date;
};

export const parseDateToMDY = (date: string | Date) => {
  if (date instanceof Date) {
    return moment(date).format("ll");
  }
  const newDate = date.replace("/", "").trim();
  return moment(newDate, "MM/DD/YYYY").format("ll");
};
