import { BaseModel, column, computed, hasOne } from '@adonisjs/lucid/orm';
import type { HasOne } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';
import Route from '#models/route';

export default class Tour extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare route: number;

  @column.date()
  declare dateFrom: DateTime;

  @column.date()
  declare dateTo: DateTime;

  @column({})
  declare price: number;

  @computed()
  get duration() {
    return this.dateTo ? this.dateTo?.diff(this.dateFrom).as('days') + 1 : 1;
  }

  @hasOne(() => Route, {
    localKey: 'route',
  })
  declare tours: HasOne<typeof Route>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime;
}
