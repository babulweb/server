export const CurrentDate = () => {
  const now = new Date();

  // If server is NOT IST, uncomment this line to add offset
  // now.setTime(now.getTime() + 5.5 * 60 * 60 * 1000);

  const pad = (n) => (n < 10 ? "0" + n : n);

  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();

  return `${day}-${month}-${year}`;
};


export const CurrentTime = () => {
  const now = new Date();

  // If server is NOT IST, uncomment this line to add offset
  // now.setTime(now.getTime() + 5.5 * 60 * 60 * 1000);

  const pad = (n) => (n < 10 ? "0" + n : n);

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${hours}:${minutes}:${seconds}`;
};


export const DateTime = () => {
  const now = new Date();

  // convert UTC to IST by adding 5.5 hours in ms
  const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);

  const pad = (n) => (n < 10 ? "0" + n : n);

  const day = pad(istTime.getUTCDate());
  const month = pad(istTime.getUTCMonth() + 1);
  const year = istTime.getUTCFullYear();

  const hours = pad(istTime.getUTCHours());
  const minutes = pad(istTime.getUTCMinutes());
  const seconds = pad(istTime.getUTCSeconds());

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

