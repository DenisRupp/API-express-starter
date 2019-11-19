const sinon = require('sinon');
const { expect } = require('chai');
const nodemailer = require('nodemailer');
const faker = require('faker');
const mailer = require('../../services/mailer');
const { SITE_URL } = require('../../../config/vars');

const sandbox = sinon.createSandbox();

describe('Test mailer service', () => {
  let data = {};
  let transport = {};

  beforeEach(async () => {
    data = {
      from: process.env.EMAIL_SENDER,
      to: faker.internet.email,
      subject: faker.lorem.words(),
      template: faker.lorem.word(),
      context: { site_url: SITE_URL },
    };

    transport = {
      sendMail: () => Promise.resolve('Success'),
      use: () => this,
      close: () => Promise.resolve('Success'),
    };

    sandbox.stub(nodemailer, 'createTransport').returns(transport);
  });

  afterEach(() => sandbox.restore());

  it('Should send email with right params', async () => {
    const sendMailSpy = sinon.spy(transport, 'sendMail');
    const mail = await mailer(
      data.to,
      data.subject,
      data.template,
      data.context,
    );
    sinon.assert.calledWith(sendMailSpy, data);
    expect(mail).to.eq('Success');
  });
});
