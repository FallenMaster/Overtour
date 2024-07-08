import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';

export default class Menu extends BaseModel {
   @column({ isPrimary: true })
   declare id: number;

   @column({})
   declare title: string;

   @column({})
   declare user_id: number;

   @column({
      serialize: (value) => JSON.parse(value),
   })
   declare content: string;

   @column({
      serialize: (value) => JSON.parse(value),
   })
   declare settings: object;

   @column({
      serialize: (value) => !!value,
   })
   declare is_current: boolean;

   @column.dateTime({ autoCreate: true })
   declare created_at: DateTime;

   @column.dateTime({ autoCreate: true, autoUpdate: false })
   declare updated_at: DateTime;
}
