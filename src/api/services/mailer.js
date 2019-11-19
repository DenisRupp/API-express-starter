/* eslint-disable no-param-reassign */
const hbs = require('nodemailer-express-handlebars');
const nodeMailer = require('nodemailer');
const {
  EMAIL_HOST,
  EMAIL_SENDER,
  EMAIL_PASSWORD,
  SITE_URL,
} = require('../../config/vars');

const handlebarsConfig = {
  viewEngine: {
    extname: '.hbs',
    layoutsDir: 'src/views/emails/',
    partialsDir: 'src/views/emails/partials/',
  },
  viewPath: 'src/views/emails/',
  extName: '.hbs',
};

const emailConfig = {
  host: EMAIL_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: EMAIL_SENDER,
    pass: EMAIL_PASSWORD,
  },
};

module.exports = (to, subject, template, context) => {
  const mailer = nodeMailer.createTransport(emailConfig);
  mailer.use('compile', hbs(handlebarsConfig));
  // allow use front url for email links
  const email = {
    from: EMAIL_SENDER,
    to,
    subject,
    template,
    context: {
      ...context,
      site_url: SITE_URL,
    },
  };

  return mailer.sendMail(email).then(() => mailer.close());
};
