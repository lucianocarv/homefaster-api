import twlsendgrid from '@sendgrid/mail';

// twlsendgrid.setApiKey();

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
