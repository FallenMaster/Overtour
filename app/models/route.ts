import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import type { HasMany } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';
import { Club } from '#common/clubs';
import { Region } from '#common/regions';
import { Tag } from '#common/tags';
import Tour from '#models/tour';

export default class Route extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column({})
  declare title: string;

  @column({})
  declare link: string;

  @column({})
  declare club: Club | null;

  @column({})
  declare description: string | null;

  @column({})
  declare image: string | null;

  @column({})
  declare difficulty: number | null;

  @column({})
  declare region: Region | null;

  @column({})
  declare tag: Tag | null;

  @hasMany(() => Tour, {
    foreignKey: 'route',
    localKey: 'id',
  })
  declare tours: HasMany<typeof Tour>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updated_at: DateTime;
}
