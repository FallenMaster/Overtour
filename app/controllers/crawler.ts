import type { HttpContext } from '@adonisjs/core/http';
import logger from '@adonisjs/core/services/logger';
import { ModelObject } from '@adonisjs/lucid/types/model';
import { JSDOM } from 'jsdom';
import { clubs } from '#common/clubs';
import { parseNumberFromString } from '#common/parse';
import { BaseRoute } from '#common/route';
import Route from '#models/route';
import Tour from '#models/tour';

type Routes = (BaseRoute | Route | ModelObject)[];

interface Report {
  found: number;
  unique: number;
}

export default class Crawler {
  async getClubPageNodes(url: string, selector: string): Promise<Element[]> {
    const document = await JSDOM.fromURL(url).then(({ window }) => window.document);

    return Array.from(document.querySelectorAll(selector));
  }

  async parseClubRoutes({ request }: HttpContext): Promise<{ report: Report; routes: Routes }> {
    const { id } = request.params();
    const club = clubs[id];
    const output = {
      routes: [] as Routes,
      report: {
        found: 0,
        unique: 0,
      } as Report,
    };

    for (let url of club.links) {
      const nodes = await this.getClubPageNodes(url, club.selectors.listItem);
      const routes: Routes = nodes.map((document) => new BaseRoute(document, clubs[club.id]));

      await Route.fetchOrCreateMany('link', routes).then((res) => {
        res.forEach((route: Route) => {
          output.routes.push(route.serialize());
          output.report.found++;
          if (route.$isLocal) {
            output.report.unique++;
          }
        });
      });
    }

    return output;
  }

  async parseTours({ request }: HttpContext): Promise<Route[]> {
    const { id } = request.params();
    const club = clubs[id];
    const routes = await Route.query().where('club', id);

    for (let route of routes) {
      const document = await JSDOM.fromURL(route.link)
        .then(({ window }) => window.document)
        .catch(async (err) => {
          if (parseNumberFromString(err.message) === 404) {
            logger.warn(`Route not found ${route.link}`);
            const outdatedRoute = await Route.findBy('link', route.link);
            await outdatedRoute.delete();
          }
        });

      if (document) {
        const detailed = club.parseDetails(route, document);

        route.fill(detailed.route);
        await route.save();

        const uniqueTours = await this.getNotExistingTours(detailed.tours, route.id);
        await route.related('tours').createMany(uniqueTours);
      }
    }

    return Route.query().where('club', id).preload('tours');
  }

  async getNotExistingTours(parsedTours: Pick<Tour, 'dateFrom' | 'dateTo' | 'price'>[], routeId: number) {
    const existingTours = await Tour.query().where('route', routeId);

    return parsedTours.filter(
      (tour) =>
        !existingTours.some(
          (existingTour) => existingTour.dateFrom.toFormat('yyyy-MM-dd') === tour.dateFrom.toFormat('yyyy-MM-dd'),
        ),
    );
  }
}
