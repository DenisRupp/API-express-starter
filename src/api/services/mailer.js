/* eslint-disable no-param-reassign */
const hbs = require('nodemailer-express-handlebars');
const nodeMailer = require('nodemailer');

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
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

module.exports = (to, subject, template, context) => {
  const from = process.env.EMAIL_SENDER;
  const mailer = nodeMailer.createTransport(emailConfig);
  mailer.use('compile', hbs(handlebarsConfig));
  // allow use front url for email links
  context.site_url = process.env.SITE_URL;
  const email = {
    from,
    to,
    subject,
    template,
    context,
  };

  return mailer.sendMail(email).then(() => mailer.close());
};
