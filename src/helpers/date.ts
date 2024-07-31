export const getCurrentTimeStamp = (): Date => {
  const current = new Date();
  return new Date(
    Date.UTC(
      current.getFullYear(),
      current.getMonth(),
      current.getDate(),
      current.getHours(),
      current.getMinutes(),
      current.getSeconds(),
      current.getMilliseconds(),
    ),
  );
};
