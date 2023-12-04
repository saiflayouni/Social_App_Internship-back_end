import { createTransport } from 'nodemailer';
import {
	SMTP_HOST,
	SMTP_PASSWORD,
	SMTP_PORT,
	SMTP_USER,
	__DEV__,
} from '../config/default.js';

import ejs from 'ejs';
import createPath from './pather.js';

const transporter = createTransport({
	// @ts-ignore
	host: SMTP_HOST,
	port: SMTP_PORT,
	secure: !__DEV__,
	auth: {
		user: SMTP_USER,
		pass: SMTP_PASSWORD,
	},
    tls: {
        ciphers:'SSLv3'
    }
});

export const sendEmail = (to, subject, body) => {
	let resp = {};

	transporter.sendMail(
		{
			from: SMTP_USER,
			to: to,
			subject: subject,
			text: body,
		},
		(error) => {
			resp = { error: error };
		}
	);

	return resp;
};

export const sendTemplatedEmail = async (to, subject, code) => {
	let resp = {};

    const template = '../public/emails/code-email.ejs';

    const path = createPath(template);

    const content = await ejs.renderFile(path, { code }, { async: true });
    if (!content) return { error: 'Error reading template!' };


	transporter.sendMail(
		{
			from: SMTP_USER,
			to: to,
			subject: subject,
			html: content,
		},
		(error) => {
			resp = { error: error };
		}
	);

	return resp;
};
