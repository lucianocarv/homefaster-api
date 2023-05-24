import { env_sendgrid_apikey } from '../../environment';
import twlsendgrid from '@sendgrid/mail';

const apiKey = env_sendgrid_apikey;
twlsendgrid.setApiKey(apiKey);

const mailServices = {
  sendTestMail: async () => {
    const res = await twlsendgrid.send({
      to: '',
      from: '',
      subject: '',
      templateId: '',
      dynamicTemplateData: {
        path: ''
      }
    });
    console.log(res);
  }
};

export { mailServices };
