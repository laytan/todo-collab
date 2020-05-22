const { Service } = require('feathers-knex');
const { BadRequest, Forbidden, NotFound, GeneralError } = require('@feathersjs/errors');

exports.UserHasAccess = class UserHasAccess extends Service {
  constructor(options, app) {
    super({
      ...options,
      name: 'user_has_access',
    });

    this.app = app;
  }

  async remove(listId, params) {
    const { user: { id: authUserId }, query: { user_id: userId } } = params;
    if(!userId) {
      throw new BadRequest('User id is required.');
    }

    const record = (await this.app.service('user-has-access').find({ paginate: false, query: { user_id: userId, list_id: listId } }))[0];
    if(!record) {
      throw new NotFound(`No access found for user: ${userId} on list: ${listId}`);
    }

    if(!record.granter_id === authUserId) {
      throw new Forbidden('You did not grant access so you can\'t revoke it.');
    }

    return await this.app.service('user-has-access').patch(record.id, { status: 0 });
  }
};
