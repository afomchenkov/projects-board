import { format, toDate, differenceInDays, parseISO } from "date-fns";

const DATE_FORMAT = "MM/dd/yyyy";

export const formatDate = (date: string) => format(toDate(date), DATE_FORMAT);

export const daysFromNow = (date: string) => {
  const givenDate = parseISO(date);
  const now = new Date();
  return differenceInDays(now, givenDate);
}

export const toDashedLowerCase = (str: string) => str.toLowerCase().replace(' ', '-');

export const capitalize = (str: string) => {
  return str.charAt(0).toLocaleUpperCase() + str.substring(1);
};

export const parseDateString = (date: string) => new Date(date).toUTCString();

export const Noop = () => { };

export const generateRandomStr = (length: number): string => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;

  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}
