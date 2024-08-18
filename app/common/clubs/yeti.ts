import logger from '@adonisjs/core/services/logger';
import { DateTime } from 'luxon';
import CommonRoute from '#common/clubs/common';
import { parseNumberFromString } from '#common/parse';
import { Region } from '#common/regions';
import { Tag } from '#common/tags';
import Route from '#models/route';
import Tour from '#models/tour';

export const parseYetiRoutes = (
  route: Route,
  document: Document,
): { route: Pick<Route, 'id' | 'title' | 'link' | 'club'>; tours: Pick<Tour, 'dateFrom' | 'dateTo' | 'price'>[] } => {
  const currentRoute = new Yeti(route, document);

  return {
    route: currentRoute,
    tours: currentRoute.getTours(document),
  };
};

export class Yeti extends CommonRoute {
  constructor(route: Route, document: Document) {
    super();
    this.id = route.id;
    this.title = route.title;
    this.link = route.link;
    this.club = route.club;
    this.setDifficulty(document);
    this.setDescription(document, '#detail > div > div:nth-child(1) > div > div div');
    this.setRegion(document);
    this.setTag(document);
    this.setImage(document.querySelector('.gdlr-core-gallery-item a img')?.getAttribute('data-src'));
  }

  setDifficulty(document: Document) {
    try {
      const text = document.querySelector(
        '#tourmaster-page-wrapper .tourmaster-single-tour-content-wrap > div > div:nth-child(1) > div > div:nth-child(2) > div > ul > li:nth-child(4) > div > span',
      )?.textContent;
      const match = text?.match(/\d+/g);
      if (match) {
        this.difficulty = +(match.at(0) as string);
      }
    } catch (err) {
      logger.error({ link: this.link, parsedValue: 'difficulty', err }, 'Parsing error');
    }
  }

  setRegion(document: Document) {
    try {
      const clubRegions = {
        'Регион: Республика Алтай': Region.Altai,
        'Район: Байкал, Ольхон': Region.Baikal,
        'Регион: Западные Саяны': Region.Sibir,
        'Регион: Забайкальский край': Region.Sibir,
        'Регион: Магаданская область': Region.DalniVostok,
        'Регион: Республика Адыгея, Кавказ': Region.Kavkaz,
        'Регион: Камчатка': Region.Kamchatka,
        'Регион: Кольский полуостров, Оленегорск': Region.Kolsky,
        'Регион: Красноярский край': Region.PlatoPutorano,
        'Регион: Курильские острова': Region.Kurily,
        'Регион: Курильские острова и Сахалин': Region.Kurily,
        'Регион: Уральские горы': Region.Ural,
        'Регион: Полярный Урал': Region.Ural,
        'Регион: Северный Урал': Region.Ural,
        'Регион: Приполярный Урал': Region.Ural,
        'Регион: Свердловская обл, ХМАО и Коми': Region.Ural,
      };

      const region = document
        .querySelector(
          '#tourmaster-page-wrapper > .tourmaster-template-wrapper > .tourmaster-single-tour-content-wrap > div > div:nth-child(1) > div > div:nth-child(2) > div > ul > li:nth-child(3) > div > span',
        )
        ?.textContent?.trim() as string;
      // @ts-ignore
      this.region = clubRegions[region];
    } catch (err) {
      logger.error({ link: this.link, parsedValue: 'region', err }, 'Parsing error');
    }
  }

  setTag(document: Document) {
    try {
      const clubTags = {
        'Тип: пеший поход': Tag.Hiking,
        'Тип: лыжный поход': Tag.Ski,
        'Тип: вертолётная экскурсия': Tag.Weekend,
        'Тип: автотур комфорт': Tag.Auto,
      };

      const tag = document
        .querySelector(
          '#tourmaster-page-wrapper > .tourmaster-template-wrapper > .tourmaster-single-tour-content-wrap > div > div:nth-child(1) > div > div:nth-child(2) > div > ul > li:nth-child(2) > div > span',
        )
        ?.textContent?.trim() as string;
      // @ts-ignore
      this.tag = clubTags[tag];
    } catch (err) {
      logger.error({ link: this.link, parsedValue: 'tag', err }, 'Parsing error');
    }
  }

  getTours(document: Document) {
    const price = parseNumberFromString(document.querySelector('.tourmaster-tail')?.textContent);
    const selectOptions = document.querySelectorAll('.tourmaster-tour-booking-date option');
    return Array.from(selectOptions.length ? selectOptions : document.querySelectorAll('[name="tour-date"]')).map(
      (dateStart: any) => {
        const dateFrom = DateTime.fromISO(dateStart.value);
        const durationText = document
          .querySelector(
            '#tourmaster-page-wrapper > .tourmaster-template-wrapper > .tourmaster-single-tour-content-wrap > div > div:nth-child(1) > div > div:nth-child(2) > div > ul > li:nth-child(1) > div > span',
          )
          ?.textContent?.trim() as string;
        const days = +durationText.split(' ')[0] - 1;

        const dateTo = days ? dateFrom.plus({ days }) : null;

        return {
          dateFrom,
          dateTo,
          price,
        };
      },
    );
  }
}
