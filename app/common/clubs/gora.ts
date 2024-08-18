import logger from '@adonisjs/core/services/logger';
import CommonRoute from '#common/clubs/common';
import { parseDatesFromText, parseNumberFromString } from '#common/parse';
import { Region } from '#common/regions';
import { Tag } from '#common/tags';
import Route from '#models/route';
import Tour from '#models/tour';

export const parseGoraRoutes = (
  route: Route,
  document: Document,
): { route: Pick<Route, 'id' | 'title' | 'link' | 'club'>; tours: Pick<Tour, 'dateFrom' | 'dateTo' | 'price'>[] } => {
  const currentRoute = new Gora(route, document);

  return {
    route: currentRoute,
    tours: currentRoute.getTours(document),
  };
};

export class Gora extends CommonRoute {
  constructor(route: Route, document: Document) {
    super();
    this.id = route.id;
    this.title = route.title;
    this.link = route.link;
    this.club = route.club;

    if (['грузия'].includes(document.querySelector('.page_title').textContent.toLowerCase())) {
      return;
    }

    this.setDifficulty(document);
    this.setDescription(document, '.text_block');
    this.setRegion(document);
    // this.setTag(document);
    this.setImage(document.querySelector('.cont .params + img').getAttribute('data-src'), route.link);
  }

  setDifficulty(document: Document) {
    try {
      const difficulty = document.querySelectorAll('.params > div:nth-child(6) > div:nth-child(2) > .circles > .circle.active').length;
      if (Number.isInteger(difficulty)) {
        this.difficulty = difficulty;
      }
    } catch (err) {
      logger.error({ link: this.link, parsedValue: 'difficulty', err }, 'Parsing error');
    }
  }

  setRegion(document: Document) {
    try {
      const clubRegions = {
        'Алтай': Region.Altai,
        'Байкал': Region.Baikal,
        'Урал': Region.Ural,
        'Кольский полуостров': Region.Kolsky,
        'Сибирь': Region.Sibir,
        'Кавказ': Region.Kavkaz,
      };

      const region = document.querySelectorAll('.breadcrumbs [itemprop="itemListElement"]')[2].textContent.trim() as string;

      if (document.querySelector('.page_title').textContent.toLowerCase().includes('камчатк')) {
        this.region = Region.Kamchatka;
      } else if (document.querySelector('.page_title').textContent.toLowerCase().includes('сахалин')) {
        this.region = Region.Sakhalin;
      } else if (document.querySelector('.page_title').textContent.toLowerCase().includes('курильские')) {
        this.region = Region.Kurily;
      } else {
        // @ts-ignore
        this.region = clubRegions[region];
        // @ts-ignore
        if (!clubRegions[region] || !this.region) {
          logger.error({ link: this.link, parsedValue: `region ${region}` }, 'Parsing error');
        }
      }
    } catch (err) {
      logger.error({ link: this.link, parsedValue: 'region', err }, 'Parsing error');
    }
  }

  // TODO
  setTag(document: Document) {
    try {
      const clubTags = {
        'Пеший поход': Tag.Hiking,
        'Треккинг (без тяжелых рюкзаков)': Tag.Hiking,
        'Коньковый поход': Tag.Skates,
      };

      const tag = document.querySelector('.params div .name + div').textContent.trim() as string;
      // @ts-ignore
      this.tag = clubTags[tag];
    } catch (err) {
      logger.error({ link: this.link, parsedValue: 'tag', err }, 'Parsing error');
    }
  }

  getTours(document: Document) {
    if (!document.querySelector('#buy') || document.querySelector('.big_aside .departure_dates .item.showmore__item b').textContent === 'По запросу') {
      return [];
    }

    const tours = document.querySelectorAll('.big_aside .departure_dates .item.showmore__item');

    return Array.from(tours)
      .filter(item => item.querySelector('.info b').textContent)
      .map((tourElement: Element) => {
        const { dateFrom, dateTo } = parseDatesFromText(tourElement.querySelector('.info b').textContent);
        const price = parseNumberFromString(tourElement.querySelector('.price')?.childNodes[0].textContent);

        return {
          dateFrom,
          dateTo,
          price,
        };
      });
  }
}
