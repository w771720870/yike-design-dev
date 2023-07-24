interface Day {
  year: number; // 年
  month: number; // 月
  date: number; // 日
  locale: string; // ToString
}

interface Time {
  head: string[]; //汉字周的数组
  body: Day[]; // 所查询的日期数组
  d: Day; //今日的对象，方便返回当日或者用于其他目的
}

function getCalender(
  date: Date = new Date(),
  from = 1, //从周几开始为第一列
): Time {
  from--;
  //汉字星期几的数组
  const days = ['一', '二', '三', '四', '五', '六', '日'].map(
    (_, i, a) => a[(i + from) % 7],
  );
  //年份
  const y = date.getFullYear();
  //月份
  const m = date.getMonth();
  //星期
  const D = date.getDay();
  //今天几号
  const d = date.getDate();
  //校准1号在一周的第mDay个上
  const mDay = (7 - (d % 7) + D - from) % 7;
  const obj = (i: number, mon: number = m) => {
    mon += 12;
    const month = (mon % 12) + 1;
    let year;
    switch (Math.floor(mon / 12)) {
      case 0:
        year = y - 1;
        break;
      case 1:
        year = y;
        break;
      case 2:
        year = y + 1;
        break;
    }
    const date = i;
    const locale = year + '/' + month + '/' + date;

    return { year, month, date, locale };
  };
  //填充数组让当月1号日期在指定星期上
  let c = Array.from({ length: mDay }, (_, i) =>
    obj(getMonthNum(y, m - 1) - (mDay - i - 1), m - 1),
  );
  //添加日期
  c = c.concat(Array.from({ length: getMonthNum(y, m) }, (_, i) => obj(i + 1)));
  //填充后续日期
  c = c.concat(
    Array.from({ length: 7 - (c.length % 7) }, (_, i) => obj(i + 1, m + 1)),
  );

  return {
    head: days,
    body: c,
    d: {
      year: y,
      month: m + 1,
      date: d,
      locale: date.toLocaleDateString(),
    },
  };
}

function getMonthNum(y: number, m: number) {
  m += 11;
  const flag = (y % 4 == 0 && y % 100 != 0) || y % 400 == 0;
  const months = [31, flag ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return months[m % 11];
}

export { getCalender };
