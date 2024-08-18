import logger from '@adonisjs/core/services/logger';
import { DateTime } from 'luxon';
import CommonRoute from '#common/clubs/common';
import { Region } from '#common/regions';
import { Tag } from '#common/tags';
import Route from '#models/route';
import Tour from '#models/tour';

export const parseWolfinRoutes = (
  route: Route,
  document: Document,
): { route: Pick<Route, 'id' | 'title' | 'link' | 'club'>; tours: Pick<Tour, 'dateFrom' | 'dateTo' | 'price'>[] } => {
  const currentRoute = new Wolfin(route, document);

  return {
    route: currentRoute,
    tours: currentRoute.getTours(document),
  };
};

export class Wolfin extends CommonRoute {
  constructor(route: Route, document: Document) {
    super();
    this.id = route.id;
    this.title = route.title;
    this.link = route.link;
    this.club = route.club;

    if (
      ['Турция', 'Абхазия', 'Сванетия, Грузия', 'Северная Осетия', 'Южная Осетия', 'Армения'].includes(
        document.querySelector('.event-date__location').textContent,
      )
    ) {
      return;
    }

    this.setDifficulty(document);
    this.setDescription(document);
    this.setRegion(document);
    // this.setTag(document);
    this.setImage(document, route);
  }

  setDifficulty(document: Document) {
    try {
      const difficulty = document.querySelector('.difficulty span').getAttribute('class').split('-')[2];
      if (Number.isInteger(+difficulty)) {
        this.difficulty = +difficulty;
      }
    } catch (err) {
      logger.error({ link: this.link, parsedValue: 'difficulty', err }, 'Parsing error');
    }
  }

  setDescription(document: Document) {
    try {
      this.description = document.querySelector('.info-text.typography').textContent as string;
    } catch (err) {
      logger.error({ link: this.link, parsedValue: 'description', err }, 'Parsing error');
    }
  }

  setRegion(document: Document) {
    try {
      const clubRegions = {
        'Мурманская область': Region.Kolsky,
        Карелия: Region.Karelia,
        'Республика Бурятия': Region.Baikal,
        'Коми; Ямал': Region.Ural,
        'Хабаровский край': Region.Khabarovsk,
        'Архангельская область': Region.Solovki,
      };

      const region = document.querySelectorAll('.event-detailed-param__val')[0].textContent.trim() as string;
      // @ts-ignore
      this.region = clubRegions[region];
      // @ts-ignore
      if (!clubRegions[region]) {
        logger.error({ link: this.link, parsedValue: `region ${region}` }, 'Parsing error');
      }
    } catch (err) {
      logger.error({ link: this.link, parsedValue: 'region', err }, 'Parsing error');
    }
  }

  // TODO
  setTag(document: Document) {}

  setImage(document: Document, route: Pick<Route, 'id' | 'title' | 'link' | 'club'>) {
    try {
      const url = new URL(route.link);
      this.image = (url.origin + document.querySelector('.event-detailed__cover img').getAttribute('src')) as string;
    } catch (err) {
      logger.error({ link: this.link, parsedValue: 'image', err }, 'Parsing error');
    }
  }

  getTours(document: Document) {
    const price = +(document
      .querySelector('.event-detailed-price__val')
      ?.textContent?.trim()
      .replace(/\D/g, '') as string);
    const dates = document.querySelectorAll('.event-date__period');
    const months = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ];

    if (document.querySelectorAll('.event-date__period')[0].textContent.trim() === 'Под заказ') {
      return [];
    }

    return Array.from(dates).map((dates: any) => {
      dates = dates.textContent.match(/(\d+)\s*(\W*)\s*(\d*) – (\d+)\s*(\W*)\s*(\d+)/i);

      const getDate = (dateString: string) => {
        return +dateString < 10 ? `0${dateString}` : dateString;
      };

      const getMonth = (monthString: string) => {
        const month = months.indexOf(monthString.trim()) + 1;
        return +month < 10 ? `0${month}` : month;
      };

      const dateFrom = DateTime.fromISO(`${dates[3]}-${getMonth(dates[2])}-${getDate(dates[1])}`);
      const dateTo = DateTime.fromISO(`${dates[6]}-${getMonth(dates[5])}-${getDate(dates[4])}`);

      return {
        dateFrom,
        dateTo,
        price,
      };
    });
  }
}
