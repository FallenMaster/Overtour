import logger from '@adonisjs/core/services/logger';
import { Club, ClubInfo } from '#common/clubs';

export class BaseRoute {
  declare title: string;
  declare link: string;
  declare club: Club;

  constructor(document: Element, clubInfo: ClubInfo) {
    this.setTitle(document, clubInfo.selectors.title);
    this.setClub(clubInfo.id);
    this.setLink(document, clubInfo.selectors.link, clubInfo.url);
  }

  protected setTitle(document: Element, title: string) {
    try {
      this.title = document.querySelector(title)!.textContent!.trim();
    } catch (err) {
      logger.error({ parsedValue: 'title', err }, 'Parsing error');
    }
  }

  protected setLink(document: Element, link: string | null, website: string) {
    try {
      const url = (
        link ? document.querySelector(link) : document
      )?.getAttribute('href') as string;
      this.link = url.startsWith('http') ? url : website + url;
    } catch (err) {
      logger.error({ parsedValue: 'link', err }, 'Parsing error');
    }
  }

  protected setClub(club: Club) {
    this.club = club;
  }
}
