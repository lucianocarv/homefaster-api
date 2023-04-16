import nodemailer from 'nodemailer';

const host = process.env.MAIL_HOST_SMTP;
const port = process.env.MAIL_HOST_PORT;
const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASS;

interface TransportOptions {
  host?: string;
  port?: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

let transportOptions: TransportOptions;

if (host && user && pass) {
  transportOptions = {
    host,
    port: Number(port),
    secure: true,
    auth: {
      user,
      pass
    }
  };
} else throw new Error('Email ou usuário não definido para as opções de transporte do Nodemailer!');

export function mailer() {
  const transporter = nodemailer.createTransport(transportOptions);
  return transporter;
}
