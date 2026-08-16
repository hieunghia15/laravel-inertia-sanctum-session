import * as yup from 'yup';

export const registerSchema = yup.object({
    name: yup.string().trim().required('Name is required.').max(255, 'Name must not exceed 255 characters.'),
    email: yup.string().trim().required('Email is required.').email('Please enter a valid email address.').max(255, 'Email must not exceed 255 characters.'),
    password: yup.string().required('Password is required.').min(8, 'Password must be at least 8 characters.'),
    password_confirmation: yup
        .string()
        .required('Password confirmation is required.')
        .oneOf([yup.ref('password')], 'Password confirmation does not match.'),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;

export const loginSchema = yup.object({
    email: yup.string().trim().required('Email is required.').email('Please enter a valid email address.'),
    password: yup.string().required('Password is required.'),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
