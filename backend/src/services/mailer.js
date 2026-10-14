import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
});

export async function verifyMailer() {
    try {
        await transporter.verify();
        logger.info(`mailer: connected to ${env.SMTP_HOST}:${env.SMTP_PORT}`);
    } catch (err) {
        logger.error(`mailer: verification failed — ${err.message}`);
    }
}

export async function sendMail({ to, subject, html, text, from }) {
    const info = await transporter.sendMail({
        from: from || env.EMAIL_FROM,
        to,
        subject,
        html,
        text,
    });
    if (env.isDev) logger.debug(`mailer: queued "${subject}" → ${to} (${info.messageId})`);
    return info;
}