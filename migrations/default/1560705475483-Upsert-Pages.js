import {getModels} from '@boilerplatejs/core/lib/Sequelize';

/**
 * Migrate UP/DOWN
 * 
 * 
 * Use `models` for your immediate bundle models within your `up`/`down` methods.
 * Bundle models are stored in your bundle's own database.
 * Every bundle implictly has the following models (without explicit definitions required):
 *  - `ServiceConfiguration`
 *  - `ComponentConfiguration`
 *  - `Environment`
 * Migrations are run on every `npm i` (or upon Docker container startup.)
 * Timestamps are encouraged as the migration filename prefix for reliability.
 * There is a utility to generate the timestamp (in development mode):
 *  - `http://localhost:${BOILERPLATE_PORT:-8082}/timestamp`
 * 
 * Example:
 * 
 * ```
 *  const {MyBundleModel} = models;
 *  await MyBundleModel.create({ ... });
 * ```
 * 
 * 
 * Use `getModels()` for platform models within your `up`/`down` methods.
 * Most, if not all, platform models should be manipulated from a platform admin.
 * Platform models are stored in their own "global" platform database.
 * Platform models include:
 *  - `Layout`
 *  - `Page`
 *  - `MetaTag`
 *  - `Script`
 *  - `Link`
 *  - `Session`
 *  - `Robot` (robots.txt processing)
 * 
 * Example:
 * 
 * ```
 *  const {Page} = getModels();
 *  await Page.create({ route: ..., title: ..., ... });
 * ```
 */
export default class {
  static async up(models, sequelize, DataTypes) {
    const {Page} = getModels();

    await Page.update({
        route: 'stream(/:collection)/:slug/:month/:day/:year',
    }, { where: { route: 'tv/:title/:date/:id' } });

    await Page.update({
        route: 'stream(/:slug)',
        page: '@fox-zero/content:Collection',
        sections: '["@fox-zero/content:Collection"]'
    }, { where: { route: 'tv(/:collection)' } });
  }

  static async down(models, sequelize, DataTypes) {
    const {Page} = getModels();

    await Page.update({
        route: 'tv/:title/:date/:id'
    }, { where: { route: 'stream(/:collection)/:slug/:month/:day/:year' } });

    await Page.update({
        route: 'tv(/:collection)',
        page: '@fox-zero/content:PostCollection',
        sections: '["@fox-zero/content:PostCollection"]'
    }, { where: { route: 'stream(/:slug)' } });
  }
}
