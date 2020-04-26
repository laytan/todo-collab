const EmailTemplates = require('swig-email-templates');
const templates = new EmailTemplates({ root: 'src/mail' });

module.exports = function(app) {
  function getLink(type, hash) {
    return `${process.env.CLIENT_URL}/${type}?token=${hash}`;
  }

  function sendEmail(email) {
    return app.service('mailer').create(email).then(function (result) {
      console.log('Sent email', result);
    }).catch(err => {
      console.error('Error sending email', err);
    })
  }

  function template(path, context) {
    return new Promise((resolve, reject) => {
      const additionalContext = {
        clientURL: process.env.CLIENT_URL,
        unsubscribeURL: 'todo',
      };

      templates.render(path, {...context, ...additionalContext}, (err, html, text, subject) => {
        if (err) {
          reject(err);
        }
        resolve({ html, text, subject });
      });
    });
  }

  return {
    notifier: async function(type, user) {
      let tokenLink;
      let email;
      let compiledTemplate;

      switch (type) {
        // Sending the user the verification email
        case 'resendVerifySignup':
          tokenLink = getLink('verify', user.verifyToken);
          compiledTemplate = await template('resendVerifySignup.html', { user, tokenLink });
          email = {
            from: process.env.MAIL_FROM,
            to: user.email,
            subject: 'Verify Your Email',
            html: compiledTemplate.html,
            text: compiledTemplate.text,
          };
          return sendEmail(email);

        // Confirming the verification
        case 'verifySignup':
          tokenLink = getLink('verify', user.verifyToken);
          compiledTemplate = await template('verifySignup.html', { user });
          email = {
            from: process.env.MAIL_FROM,
            to: user.email,
            subject: 'Thank you for signing up',
            html: compiledTemplate.html,
            text: compiledTemplate.text,
          };
          return sendEmail(email);
        
        // Send pw reset token
        case 'sendResetPwd':
          tokenLink = getLink('reset', user.resetToken);
          compiledTemplate = await template('sendResetPwd.html', { tokenLink, user });
          email = {
            from: process.env.MAIL_FROM,
            to: user.email,
            subject: 'Password Reset Link',
            html: compiledTemplate.html,
            text: compiledTemplate.text,
          };
          return sendEmail(email);

        // PW reset confirmation
        case 'resetPwd':
          tokenLink = getLink('reset', user.resetToken);
          compiledTemplate = await template('resetPwd.html', { tokenLink, user });
          email = {
            from: process.env.MAIL_FROM,
            to: user.email,
            subject: 'Your password has been reset',
            html: compiledTemplate.html,
            text: compiledTemplate.text,
          };
          return sendEmail(email);
        
        // case 'passwordChange':
        //   email = {
        //     from: process.env.MAIL_FROM,
        //     to: user.email,
        //     subject: 'Password Change',
        //     html: 'password change',
        //   };
        //   return sendEmail(email);

        // case 'identityChange':
        //   tokenLink = getLink('verifyChanges', user.verifyToken);
        //   email = {
        //     from: process.env.MAIL_FROM,
        //     to: user.email,
        //     subject: 'Identity Change',
        //     html: 'Identity Change',
        //   };
        //   return sendEmail(email);
      };
    },
  };
};
