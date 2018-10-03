const nodemailer = require('nodemailer');
const sinon = require('sinon');

const transport = {
  sendMail: () => {
    console.log('Sent email');
    return Promise.resolve('Success');
  },
  use: () => this,
  close: () => Promise.resolve('Success'),
};

exports.stub = sandbox =>
  sandbox.stub(nodemailer, 'createTransport').returns(transport);
exports.spy = () => sinon.spy(transport, 'sendMail');
exports.restore = () => nodemailer.createTransport.restore();
