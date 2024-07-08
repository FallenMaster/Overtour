import type { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';
import { registerValidator } from '#validators/auth';

export default class AuthController {
   async register({ auth, request, response }: HttpContext) {
      const data = await request.validateUsing(registerValidator);
      const user = await User.create(data);

      await auth.use('web').login(user);

      return response.created(user);
   }

   async login({ request, auth }: HttpContext) {
      const { email, password } = request.only(['email', 'password']);

      const user = await User.verifyCredentials(email, password);
      await auth.use('web').login(user);

      // FIXME return token
      return user;
   }

   async logout({ auth }: HttpContext) {
      return auth.use('web').logout();
   }

   async getUserInfo({ auth }: HttpContext) {
      return auth.authenticate();
   }
}
