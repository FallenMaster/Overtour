import logger from '@adonisjs/core/services/logger';
import CommonRoute from '#common/clubs/common';
import { parseDatesFromText, parseNumberFromString } from '#common/parse';
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
    this.setDescription(document, '.info-text.typography');
    this.setRegion(document);
    // this.setTag(document);
    this.setImage(document.querySelector('.event-detailed__cover img').getAttribute('src'), route.link);
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

  setRegion(document: Document) {
    try {
      const clubRegions = {
        'Мурманская область': Region.Kolsky,
        Карелия: Region.Karelia,
        'Республика Бурятия': Region.Baikal,
        'Коми; Ямал': Region.Ural,
        'Ямал': Region.Ural,
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

  getTours(document: Document) {
    if (document.querySelectorAll('.event-date__period')[0].textContent.trim() === 'Под заказ') {
      return [];
    }

    const price = parseNumberFromString(document.querySelector('.event-detailed-price__val')?.textContent);
    const dates = document.querySelectorAll('.event-date__period');

    return Array.from(dates).map((date: Element) => {
      const { dateFrom, dateTo } = parseDatesFromText(date.textContent);
      return {
        dateFrom,
        dateTo,
        price,
      };
    });
  }
}
