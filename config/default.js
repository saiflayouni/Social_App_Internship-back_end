import { config } from 'dotenv'

config()

export const PORT = process.env.PORT || 3000

export const __DEV__ = process.env.NODE_ENV === 'dev'

export const HASH_ROUNDS = Number.parseInt(process.env.HASH_ROUNDS ?? '10')

export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION

export const REFRESH_SECRET = process.env.REFRESH_SECRET
export const REFRESH_EXPIRATION = process.env.REFRESH_EXPIRATION

export const SMTP_USER = `${process.env.SMTP_USER}`;
export const SMTP_PORT = `${process.env.SMTP_PORT}`;
export const SMTP_HOST = `${process.env.SMTP_HOST}`;
export const SMTP_PASSWORD = `${process.env.SMTP_PASSWORD}`;


export const EMAILJS_PUB_KEY = `${process.env.EMAILJS_PUB_KEY}`
export const EMAILJS_PRIV_KEY = `${process.env.EMAILJS_PRIV_KEY}`
export const EMAIL_JS_TEMPLATE_ID = `${process.env.EMAIL_JS_TEMPLATE_ID}`
export const EMAIL_JS_SERVICE_ID = `${process.env.EMAIL_JS_SERVICE_ID}`
