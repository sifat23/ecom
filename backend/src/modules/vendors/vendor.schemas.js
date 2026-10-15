import * as yup from 'yup';

export const vendorRegisterSchema = yup.object({
    businessName:           yup.string().trim().required().max(255),
    businessDescription:    yup.string().trim().max(2000),
    businessRegistrationNo: yup.string().trim().max(100),
    taxId:                  yup.string().trim().max(100),
    phone:                  yup.string().trim().max(20),
});