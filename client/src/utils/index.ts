export const capitalize = (str: string) => {
  return str.charAt(0).toLocaleUpperCase() + str.substring(1);
};

export const parseDateString = (date: string) => new Date(date).toUTCString();

export const Noop = () => { };
