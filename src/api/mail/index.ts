import { mailer } from './config';

const baseURL = process.env.BASE_URL!;

const appMail = {
  sendMailToConfirmAccount: async (username: string, userMail: string, token: string) => {
    const mailServer = mailer();
    const info = await mailServer
      .sendMail({
        from: 'Rentfaster Clone <example@example>',
        to: userMail,
        subject: 'Confirme sua conta no Rentfaster Clone!',
        html: `
        <h3>Olá ${username}, confirme sua conta:</h3>
        <a href="${baseURL}/users/confirm/account?mail=${userMail}&token=${token}">Confirmar</a>
        <p>
        ${token}
        </p>
      `,
      })
      .catch((err) => {
        throw { err, message: 'Não foi possivel enviar o email' };
      });
    return info;
  },
};

export default appMail;
