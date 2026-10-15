import * as yup from 'yup';

const passwordRule = yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be at most 100 characters')
    .matches(/[A-Za-z]/, 'Password must contain at least one letter')
    .matches(/\d/, 'Password must contain at least one number');

const emailRule = yup
    .string()
    .required('Email is required')
    .email('Enter a valid email')
    .max(255)
    .lowercase()
    .trim();

export const registerSchema = yup.object({
    email: emailRule,
    password: passwordRule,
    firstName: yup.string().trim().max(100).required('First name is required'),
    lastName:  yup.string().trim().max(100).required('Last name is required'),
    phone:     yup.string().trim().max(20).optional().nullable(),
    role:      yup.string().oneOf(['customer', 'vendor'], 'Invalid role').default('customer'),
});

export const loginSchema = yup.object({
    email:    emailRule,
    password: yup.string().required('Password is required'),
});

export const forgotPasswordSchema = yup.object({
    email: emailRule,
});

export const resetPasswordSchema = yup.object({
    token:       yup.string().required('Reset token is required').length(64, 'Invalid token'),
    newPassword: passwordRule,
});

export const adminLoginSchema = loginSchema; // same shape, separate controller

export const verifyEmailSchema = yup.object({
    token: yup.string().required('Verification token is required').length(64, 'Invalid token'),
});

export const resendVerificationSchema = yup.object({
    email: emailRule,
});