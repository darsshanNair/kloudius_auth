import { object, string } from 'yup';
import { APP_STRINGS } from '../constants/appStrings';

export const loginSchema = object({
  email: string()
    .email(APP_STRINGS.EMAIL_INVALID)
    .required(APP_STRINGS.EMAIL_REQUIRED),
  password: string()
    .min(6, APP_STRINGS.PASSWORD_MIN_LENGTH)
    .required(APP_STRINGS.PASSWORD_REQUIRED),
});

export const registerSchema = object({
  name: string().required(APP_STRINGS.NAME_REQUIRED),
  email: string()
    .email(APP_STRINGS.EMAIL_INVALID)
    .required(APP_STRINGS.EMAIL_REQUIRED),
  password: string()
    .min(6, APP_STRINGS.PASSWORD_MIN_LENGTH)
    .required(APP_STRINGS.PASSWORD_REQUIRED),
});
