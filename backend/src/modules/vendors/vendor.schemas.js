import * as yup from 'yup';

/* ── Step 1: Storefront ───────────────────────────────── */

/** Draft save — permissive. Every field optional. */
export const vendorStoreDraftSchema = yup.object({
    businessName:        yup.string().trim().min(2).max(255).optional(),
    businessDescription: yup.string().trim().max(2000).optional(),
});

/** Final submit of step 1 — enforces requirements. */
export const vendorStoreSubmitSchema = yup.object({
    businessName: yup
        .string()
        .trim()
        .required('Store name is required')
        .min(2, 'Store name must be at least 2 characters')
        .max(255, 'Store name is too long'),
    businessDescription: yup
        .string()
        .trim()
        .required('Store description is required')
        .min(10, 'Please write at least 10 characters')
        .max(2000, 'Description is too long'),
});


/* ── Step 2: Legal & Tax ──────────────────────────────── */

const BUSINESS_TYPES = [
    'sole_proprietor',
    'partnership',
    'llc',
    'corporation',
    'cooperative',
    'other',
];

/** Draft — permissive. Every field optional. */
export const vendorLegalDraftSchema = yup.object({
    legalBusinessName:      yup.string().trim().max(255).optional(),
    businessType:           yup.string().oneOf(BUSINESS_TYPES).optional(),
    businessRegistrationNo: yup.string().trim().max(100).optional(),
    taxId:                  yup.string().trim().max(100).optional(),
    vatNumber:              yup.string().trim().max(50).optional(),
});

/** Final submit — enforces requirements. */
export const vendorLegalSubmitSchema = yup.object({
    legalBusinessName: yup
        .string()
        .trim()
        .required('Registered legal name is required')
        .max(255, 'Legal name is too long'),

    businessType: yup
        .string()
        .oneOf(BUSINESS_TYPES, 'Select a business type')
        .required('Business type is required'),

    businessRegistrationNo: yup
        .string()
        .trim()
        .required('Business registration number is required')
        .max(100, 'Registration number is too long'),

    taxId: yup
        .string()
        .trim()
        .required('Tax ID / TIN is required')
        .max(100, 'Tax ID is too long'),

    vatNumber: yup.string().trim().max(50).optional(),
});


/* ── Step 3: Contact & Address ────────────────────────── */

/** Empty string from a number input becomes `undefined` so `.optional()` works. */
const optionalInt = () =>
    yup
        .number()
        .transform((v, original) =>
            original === '' || original === null || original === undefined ? undefined : v
        )
        .typeError('Enter a number')
        .integer('Must be a whole number')
        .min(0, 'Must be 0 or greater')
        .nullable()
        .optional();

export const vendorContactDraftSchema = yup.object({
    businessPhone:        yup.string().trim().max(20).optional(),
    businessEmail:        yup.string().trim().email('Enter a valid email').max(255).optional(),
    website:              yup.string().trim().max(255).optional(),
    yearsInBusiness:      optionalInt(),
    employeeCount:        optionalInt(),
    businessAddressLine1: yup.string().trim().max(255).optional(),
    businessAddressLine2: yup.string().trim().max(255).optional(),
    businessCity:         yup.string().trim().max(100).optional(),
    businessState:        yup.string().trim().max(100).optional(),
    businessZip:          yup.string().trim().max(20).optional(),
    businessCountry:      yup.string().trim().length(2, 'Use a 2-letter code').optional(),
});

export const vendorContactSubmitSchema = yup.object({
    businessPhone: yup
        .string()
        .trim()
        .required('Business phone is required')
        .max(20, 'Phone is too long'),

    businessEmail: yup
        .string()
        .trim()
        .email('Enter a valid email')
        .required('Business email is required')
        .max(255),

    website: yup.string().trim().max(255).optional(),

    yearsInBusiness: optionalInt(),
    employeeCount:   optionalInt(),

    businessAddressLine1: yup
        .string()
        .trim()
        .required('Address line 1 is required')
        .max(255),

    businessAddressLine2: yup.string().trim().max(255).optional(),

    businessCity: yup
        .string()
        .trim()
        .required('City is required')
        .max(100),

    businessState: yup
        .string()
        .trim()
        .required('State / region is required')
        .max(100),

    businessZip: yup
        .string()
        .trim()
        .required('Postal code is required')
        .max(20),

    businessCountry: yup
        .string()
        .trim()
        .length(2, 'Use a 2-letter code (e.g. US, DK, GB)')
        .required('Country is required'),
});

/* ── Step 4: Payouts ──────────────────────────────────── */

export const vendorBankDraftSchema = yup.object({
    bankAccountHolder: yup.string().trim().max(255).optional(),
    bankAccountNumber: yup.string().trim().max(255).optional(),
    bankName:          yup.string().trim().max(255).optional(),
    bankRoutingNumber: yup.string().trim().max(100).optional(),
    bankIban:          yup.string().trim().max(50).optional(),
    bankSwift:         yup.string().trim().max(20).optional(),
});

export const vendorBankSubmitSchema = yup.object({
    bankAccountHolder: yup
        .string()
        .trim()
        .required('Account holder name is required')
        .max(255, 'Account holder name is too long'),

    bankAccountNumber: yup
        .string()
        .trim()
        .required('Account number is required')
        .max(255, 'Account number is too long'),

    bankName: yup
        .string()
        .trim()
        .required('Bank name is required')
        .max(255, 'Bank name is too long'),

    bankRoutingNumber: yup.string().trim().max(100).optional(),
    bankIban:          yup.string().trim().max(50).optional(),
    bankSwift:         yup.string().trim().max(20).optional(),
});