import type { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';
import { DateTime } from 'luxon';
import { regions } from '#common/regions';
import Route from '#models/route';
import Tour from '#models/tour';

export default class Tours {
  async getRoutes() {
    return Route.query()
      .select('id', 'title', 'description', 'link', 'difficulty', 'region', 'tag')
      .preload('tours')
      .has('tours');
  }

  async getTours({ request }: HttpContext) {
    const { title, region, dateFrom, dateTo, tag, price, duration, page } = request.all();

    const tours = Tour.query()
      .orderBy('dateFrom')
      .select('route', 'price', 'dateFrom', 'dateTo')
      .if(dateFrom, (query) => query.where('dateFrom', '>=', dateFrom))
      .unless(dateFrom, (query) => query.where('dateFrom', '>=', DateTime.local().toISODate()))
      .if(dateTo, (query) => query.where('dateFrom', '<=', dateTo))
      // .if(duration, (query) => query.where('duration', '>=', duration[0]).where('duration', '<=', duration[1]))
      .if(price, (query) => {
        if (Array.isArray(price)) {
          query.where('price', '>=', price[0]).where('price', '<=', price[1]);
        } else {
          query.where('price', '>=', price);
        }
      })
      .groupBy('route');

    // TODO add tour count
    // TODO add club filter

    return db
      .from(tours.as('sorted_routes'))
      .leftJoin('routes', 'routes.id', 'route')
      .select(
        'id',
        'title',
        'club',
        'description',
        'link',
        'difficulty',
        'region',
        'image',
        'tag',
        'price',
        'date_from as dateFrom',
        'date_to as dateTo',
      )
      .if(title, (query) => query.where('title', 'like', `%${title}%`))
      .if(region, (query) => query.where('region', '=', region))
      .if(tag, (query) => query.where('tag', tag))
      .limit(25)
      .paginate(page ?? 1, 40);
  }

  async getTour({ params }: HttpContext) {
    return Route.query()
      .select('id', 'title', 'image', 'description', 'link', 'difficulty', 'region', 'tag')
      .where('id', params.id)
      .first();
  }

  async getRegions() {
    return regions;
  }
}
