import * as chrono from 'chrono-node';
import { DateTime } from 'luxon';

export const parseDescription = (text: string) => {
   return text.replace(/\n/g, '').trim();
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
