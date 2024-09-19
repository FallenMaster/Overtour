import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import { UserRole } from '#common/constants';

const AuthFinder = withAuthFinder(() => hash.use('bcrypt'), {
   uids: ['email'],
   passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
   @column({ isPrimary: true })
   declare id: number;

   @column()
   declare email: string;

   @column({ serializeAs: null })
   declare password: string;

   @column({ serializeAs: null })
   declare role: UserRole;

   @column.dateTime({ autoCreate: true })
   declare createdAt: DateTime;

   @column.dateTime({ autoCreate: true, autoUpdate: true })
   declare updatedAt: DateTime;
}
