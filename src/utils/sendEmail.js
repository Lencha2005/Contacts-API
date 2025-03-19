import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnvVar.js';

const nodemailerConfig = {
  host: getEnvVar('SMTP_HOST'),
  port: getEnvVar('SMTP_PORT'),
  auth: {
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASSWORD'),
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
