// Initializes the `mailer` service on path `/mailer`
const Mailer = require('feathers-mailer');
const smtpTransport = require('nodemailer-smtp-transport');
const hooks = require('./mailer.hooks');

module.exports = function mailer(app) {
  // Initialize our service with any options it requires
  app.use('/mailer', Mailer(smtpTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })));

  // Get our initialized service so that we can register hooks
  const service = app.service('mailer');

  service.hooks(hooks);
};
