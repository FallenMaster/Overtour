import { defineConfig, drivers } from '@adonisjs/core/hash';
import { InferHashers } from '@adonisjs/core/types';

const hashConfig = defineConfig({
  default: 'bcrypt',

  list: {
    bcrypt: drivers.bcrypt({
      rounds: 10,
      saltSize: 16,
      // @ts-ignore
      version: '2b'
    })
  }
});

export default hashConfig;

/**
 * Inferring types for the list of hashers you have configured
 * in your application.
 */
declare module '@adonisjs/core/types' {
  export interface HashersList extends InferHashers<typeof hashConfig> {}
}
