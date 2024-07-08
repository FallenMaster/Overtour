import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';

export default class Club extends BaseModel {
   @column({ isPrimary: true })
   declare id: number;

   @column({})
   declare title: string;

   @column({})
   declare description: string;

   @column({})
   declare link: string;

   @column.dateTime({ autoCreate: true, serializeAs: null })
   declare created_at: DateTime;

   @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
   declare updated_at: DateTime;
}
