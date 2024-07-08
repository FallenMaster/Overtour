import { BaseModel, column, computed } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';

export default class Ingredient extends BaseModel {
   @column({ isPrimary: true })
   declare id: number;

   @column({})
   declare title: string;

   @column({})
   declare type: number;

   @column({})
   declare count_caption: string;

   @column({})
   declare user_id: number;

   @computed()
   get is_default() {
      return this.user_id === 1;
   }

   @column.dateTime({ autoCreate: true })
   declare created_at: DateTime;

   @column.dateTime({ autoCreate: true, autoUpdate: true })
   declare updated_at: DateTime;
}
