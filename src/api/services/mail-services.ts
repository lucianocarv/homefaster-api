import { mailer } from '../mail/config';

const baseURL = process.env.BASE_URL!;
const defaultMail = process.env.DEFAULT_MAIL;
const mailServer = mailer();

const mailServices = {
  sendMailVerifyAccount: async (username: string, userMail: string, token: string) => {
    const info = await mailServer
      .sendMail({
        from: `Rentfaster Clone <${defaultMail}>`,
        to: userMail,
        subject: 'Confirme sua conta no Rentfaster Clone!',
        html: `
        <strong><em>ATENÇAO: Está é apenas uma aplicação de testes, não sendo utilizada para fins produtivos e/ou lucrativos!</em></strong>
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

  sendMailInformePasswordChange: async (username: string, email: string) => {
    const res = await mailServer
      .sendMail({
        from: `Rentfaster Clone <${defaultMail}>`,
        to: email,
        subject: 'ATENÇÃO: Alteração de Senha!',
        html: `
      <p>Olá ${username}, sua senha foi alterada!</p>
      <p>Se não foi você, entre em contato com nossa equipe de suporte!</p>
      `,
      })
      .catch((err) => {
        throw { err, message: 'Não foi possivel enviar o email' };
      });
    return res;
  },
};

export default mailServices;
