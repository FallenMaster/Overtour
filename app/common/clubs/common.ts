import logger from '@adonisjs/core/services/logger';
import { Club } from '#common/clubs';
import { parseDescription } from '#common/parse';
import { Region } from '#common/regions';
import { Tag } from '#common/tags';

export default class CommonRoute {
  declare id: number;
  declare title: string;
  declare link: string;
  declare club: Club | null;
  declare difficulty: number | null;
  declare description: string | null;
  declare image: string | null;
  declare region: Region | null;
  declare tag: Tag | null;

  setDescription(document: Document, selector: string) {
    try {
      this.description = parseDescription(document.querySelector(selector).textContent);
    } catch (err) {
      logger.error({ link: this.link, parsedValue: 'description', err }, 'Parsing error');
    }
  }

  setImage(imageUrl: string, routeLink: string = '') {
    try {
      const url = new URL(routeLink ? routeLink : imageUrl);
      if (routeLink) {
        url.pathname = imageUrl;
      }
      this.image = url.href;
    } catch (err) {
      logger.error({ link: this.link, parsedValue: 'image', err }, 'Parsing error');
    }
  }
}
