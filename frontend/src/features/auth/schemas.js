import * as yup from 'yup';

const passwordRule = yup
    .string()
    .required('Password is required')
    .min(8, 'At least 8 characters')
    .matches(/[A-Za-z]/, 'Must contain a letter')
    .matches(/\d/, 'Must contain a number');

export const registerSchema = yup.object({
    firstName: yup.string().trim().required('First name is required'),
    lastName:  yup.string().trim().required('Last name is required'),
    email:     yup.string().trim().email('Enter a valid email').required('Email is required'),
    phone:     yup.string().trim().optional(),
    password:  passwordRule,
    confirmPassword: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password')], 'Passwords do not match'),
    role: yup.string().oneOf(['customer', 'vendor']).required(),
});

export const loginSchema = yup.object({
    email:    yup.string().trim().email('Enter a valid email').required('Email is required'),
    password: yup.string().required('Password is required'),
});

export const forgotPasswordSchema = yup.object({
    email: yup.string().trim().email('Enter a valid email').required('Email is required'),
});

export const resetPasswordSchema = yup.object({
    newPassword: passwordRule,
    confirmPassword: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
});