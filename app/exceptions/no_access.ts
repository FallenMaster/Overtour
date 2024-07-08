import { Exception } from '@adonisjs/core/exceptions';
import { HttpContext } from '@adonisjs/core/http';

export default class NoAccessException extends Exception {
  public async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send(error.message);
  }
}
