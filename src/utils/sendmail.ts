import sgMail, {MailDataRequired} from '@sendgrid/mail'
sgMail.setApiKey('removido')

export const SendMail = async (data: MailDataRequired | MailDataRequired[]) => sgMail.send(data);