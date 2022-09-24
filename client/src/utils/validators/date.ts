import moment from "moment";
import { dateFormat } from "../formats";

// CHECK IF THE DATE IS NOT IN PAST
export const isDateInFuture = (date: string | Date | null) => {
  const currentDate = new Date();
  let isDateInPast = false;
  if (date) {
    if (date && typeof date === "string") {
      const formattedDate = date.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
      if (
        date.length === 8 &&
        moment(formattedDate, dateFormat, true).isValid()
      ) {
        isDateInPast = moment(formattedDate).isBefore(
          moment(currentDate, "DD/MM/YYYY")
        );
      }
    } else if (date && date instanceof Date) {
      isDateInPast = moment(date).isBefore(moment(currentDate, "DD/MM/YYYY"));
    } else {
      return { message: "enter a valid date" };
    }
    if (isDateInPast) {
      return { message: "enter a date in future" };
    }
    return { message: "" };
  }
  return { message: "enter date" };
};

export const isDateInPast = (date: string | Date | null) => {
  const currentDate = new Date();
  let isPast = false;
  if (date) {
    if (date && typeof date === "string") {
      const formattedDate = date.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
      if (
        date.length === 8 &&
        moment(formattedDate, dateFormat, true).isValid()
      ) {
        isPast = moment(formattedDate).isBefore(
          moment(currentDate, "DD/MM/YYYY")
        );
      }
    } else if (date && date instanceof Date) {
      isPast = moment(date).isBefore(moment(currentDate, "DD/MM/YYYY"));
    } else {
      return { message: "enter a valid date" };
    }
    if (isPast) {
      return { message: "" };
    }
    return { message: "the date should be in past" };
  }
  return { message: "enter date" };
};

export const isDateValid = (date: string) => {
  if (date && typeof date === "string") {
    const formattedDate = date.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
    return moment(formattedDate, dateFormat, true).isValid();
  }
  if (date) {
    return moment(date, dateFormat, true).isValid();
  }
  return false;
};
