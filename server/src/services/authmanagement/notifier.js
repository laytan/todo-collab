const EmailTemplates = require('swig-email-templates');

const templates = new EmailTemplates({ root: 'src/mail' });

module.exports = function notifier(app) {
  function getLink(type, hash) {
    return `${process.env.CLIENT_URL}/${type}?token=${hash}`;
  }

  async function sendEmail(email) {
    try {
      await app.service('mailer').create(email);
      return Promise.resolve();
    } catch (err) {
      console.error('Error sending email', err);
      return Promise.reject(new Error('Message could not be sent.'));
    }
  }

  function template(path, context) {
    return new Promise((resolve, reject) => {
      templates.render(path, context, (err, html, text, subject) => {
        if (err) {
          reject(err);
        }
        resolve({ html, text, subject });
      });
    });
  }

  async function sendTemplateTo(templatePath, user, context = {}) {
    const additionalContext = {
      clientURL: process.env.CLIENT_URL,
      appName: process.env.APP_NAME,
      unsubscribeURL: 'todo',
      user,
    };

    const { html, text, subject } = await template(templatePath, {
      ...context,
      ...additionalContext,
    });

    return sendEmail({
      from: process.env.MAIL_FROM,
      to: user.email,
      subject,
      text,
      html,
    });
  }

  return {
    async notifier(type, user) {
      const handlers = {
        // Email verification
        resendVerifySignup: () => sendTemplateTo('resendVerifySignup.html', user, {
          tokenLink: getLink('verify', user.verifyToken),
        }),
        verifySignup: () => sendTemplateTo('verifySignup.html', user),
        // Password reset
        sendResetPwd: () => sendTemplateTo('sendResetPwd.html', user, {
          tokenLink: getLink('reset', user.resetToken),
        }),
        resetPwd: () => sendTemplateTo('resetPwd.html', user),
      };

      return handlers[type] ? handlers[type]() : Promise.reject(new Error(`No notifier handler for type: ${type}`));
    },
  };
};
