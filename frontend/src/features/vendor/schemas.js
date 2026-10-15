// frontend/src/features/vendor/schemas.js
import * as yup from 'yup';

export const vendorRegisterSchema = yup.object({
    businessName:        yup.string().trim().required('Business name is required').max(255),
    businessDescription: yup.string().trim().max(2000),
    businessRegistrationNo: yup.string().trim().max(100),
    taxId:               yup.string().trim().max(100),
    phone:               yup.string().trim().max(20),
});