export const getFromToDateObj = (from, to) => {
  return {from: getUtc(from), to: getUtc(to)}
};
const getTodayPeriod = () => {
  let curDate = new Date();
  return getFromToDateObj(curDate, curDate)
};
const getYesterdayPeriod = () => {
  let currDate = new Date();
  let yestDate = new Date(currDate.setDate(currDate.getDate() - 1));
  return getFromToDateObj(yestDate, yestDate);
};
const getCurrWeekPeriod = () => {
  let currDate = new Date(); // get current date
  let first = new Date(currDate.setDate(currDate.getDate() - currDate.getDay() + 1));
  let last = new Date(currDate.setDate(currDate.getDate() + 6));
  return getFromToDateObj(first, last)
};
export const getUtc = (date) => {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0))
};


export const periodsData = [
  {label: "Сегодня", getPeriod: getTodayPeriod},
  {label: "Вчера", getPeriod: getYesterdayPeriod},
  {label: "Эта неделя", getPeriod: getCurrWeekPeriod}
];
