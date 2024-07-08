import type { HttpContext } from '@adonisjs/core/http';
import NoAccessException from '#exceptions/no_access';

export default class Admin_middleware {
   async checkIsAdmin(auth: HttpContext['auth']) {
      if (auth?.user?.id === 1) {
         return true;
      }
      throw new NoAccessException('No access', { status: 403, code: 'E_NO_ACCESS' });
   }

   async handle({ auth }: HttpContext, next: () => Promise<void>) {
      await this.checkIsAdmin(auth);
      await next();
   }
}
