import * as chrono from 'chrono-node';
import { DateTime } from 'luxon';

export const trimAllWhitespaces = (text: string) => {
   return text.replace(/\s+/g, '');
};

export const isPeriod = (text: string): boolean => {
   const numArray = text.match(/(\d+)/g);
   return Array.isArray(numArray) && numArray.length > 3;
}

// 11.12.2020 | 11/12/2020
const parseDateSingle = (text: string): string => {
   const dateArray = text.match(/(\d+)[\.|\/](\d+)[\.|\/](\d+)/i);
   if (dateArray && dateArray.length) {
      return prepareDateToDBFormat(dateArray[1], dateArray[2], dateArray[3]);
   } else {
      return '';
   }
};

const prepareDateToDBFormat = (day: string, month: string, year: string): string => {
   const fullYear = year.length === 4 ? year : 20 + year;
   const fullMonth = month.length === 2 ? month : 0 + month;
   const fullDay = day.length === 2 ? day : 0 + day;
   const zone = 'T00:00:00Z';
   return `${fullYear}-${fullMonth}-${fullDay}${zone}`;
};

export const parseNumberFromString = (text: string): number => {
   return +text.replace(/[^\d]/g, '');
}

export const parseDatesFromText = (text: string) => {
   const dates = chrono.ru.parse(text);
   const dateTo = dates[1]?.start?.date() || dates[0]?.end?.date() || null;
   return {
      dateFrom: DateTime.fromJSDate(dates[0]?.start?.date()),
      dateTo: dateTo ? DateTime.fromJSDate(dateTo) : null,
   }
}
