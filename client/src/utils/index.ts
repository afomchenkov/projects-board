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
