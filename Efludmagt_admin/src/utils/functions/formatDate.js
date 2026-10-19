import { months } from "../constants/staticVars";

export function formatDate(isoDateString) {
  const date = new Date(isoDateString);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = daysOfWeek[date.getUTCDay()];

  const dayOfMonth = date.getDate();

  const month = months[date.getMonth()];

  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${dayOfWeek}, ${dayOfMonth} ${month} ${year} • ${hours}:${minutes} ${ampm}`;
}

export function formatTimeStamp(timeStamp) {
  const date = new Date(timeStamp?.seconds * 1000);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = daysOfWeek[date.getDay()];

  const dayOfMonth = date.getDate();

  const month = months[date.getMonth()];

  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${dayOfWeek}, ${dayOfMonth} ${month} ${year} • ${hours}:${minutes} ${ampm}`;
}

export function getDateFromTimeStamp(timeStamp) {
  const date = new Date(timeStamp?.seconds * 1000);

  const dayOfMonth = date.getDate();

  const month = months[date.getMonth()];

  const year = date.getFullYear();

  return `${dayOfMonth} ${month} ${year}`;
}

export function formatFeedbackTime(timeStamp) {
  const date = new Date(timeStamp?.seconds * 1000);
  const now = new Date();

  const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
  const timeString = date.toLocaleTimeString("en-US", timeOptions);

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isYesterday =
    date.getDate() === now.getDate() - 1 &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return `Today at ${timeString}`;
  } else if (isYesterday) {
    return `Yesterday at ${timeString}`;
  } else {
    const dateOptions = { month: "short", day: "numeric", year: "numeric" };
    const dateString = date.toLocaleDateString("en-US", dateOptions);
    return `${dateString} at ${timeString}`;
  }
}
