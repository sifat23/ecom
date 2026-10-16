import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Field, inputCls, FormActions } from './fields';

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

const contactSchema = yup.object({
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
    website:         yup.string().trim().max(255).optional(),
    yearsInBusiness: optionalInt(),
    employeeCount:   optionalInt(),

    businessAddressLine1: yup.string().trim().required('Address line 1 is required').max(255),
    businessAddressLine2: yup.string().trim().max(255).optional(),
    businessCity:         yup.string().trim().required('City is required').max(100),
    businessState:        yup.string().trim().required('State / region is required').max(100),
    businessZip:          yup.string().trim().required('Postal code is required').max(20),
    businessCountry: yup
        .string()
        .trim()
        .length(2, 'Use a 2-letter code (e.g. US, DK, GB)')
        .required('Country is required'),
});

export default function ContactStepForm({
    initialValues,
    onSubmit,
    onSaveDraft,
    onBack,
    isSavingDraft,
    isSubmitting,
}) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting: formSubmitting },
    } = useForm({
        resolver: yupResolver(contactSchema),
        defaultValues: initialValues,
        mode: 'onBlur',
    });

    const isBusy = isSavingDraft || isSubmitting || formSubmitting;

    return (
        <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl bg-surface-container-lowest shadow-sm p-space-lg md:p-space-xl flex flex-col gap-space-md"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <Field label="Business phone" required error={errors.businessPhone?.message}>
                    <input
                        className={inputCls(errors.businessPhone)}
                        placeholder="+45 31 44 92 10"
                        {...register('businessPhone')}
                    />
                </Field>
                <Field label="Business email" required error={errors.businessEmail?.message}>
                    <input
                        type="email"
                        className={inputCls(errors.businessEmail)}
                        placeholder="hello@nordicoak.dk"
                        {...register('businessEmail')}
                    />
                </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <Field label="Website" error={errors.website?.message}>
                    <input
                        className={inputCls(errors.website)}
                        placeholder="https://nordicoak.dk"
                        {...register('website')}
                    />
                </Field>

                <div className="grid grid-cols-2 gap-space-sm">
                    <Field label="Years in business" error={errors.yearsInBusiness?.message}>
                        <input
                            type="number"
                            min={0}
                            className={inputCls(errors.yearsInBusiness)}
                            placeholder="8"
                            {...register('yearsInBusiness')}
                        />
                    </Field>
                    <Field label="Employees" error={errors.employeeCount?.message}>
                        <input
                            type="number"
                            min={0}
                            className={inputCls(errors.employeeCount)}
                            placeholder="4"
                            {...register('employeeCount')}
                        />
                    </Field>
                </div>
            </div>

            <hr className="border-outline-variant/50 my-space-xs" />

            <h3 className="font-headline-sm font-bold text-on-surface">Business address</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <Field label="Address line 1" required error={errors.businessAddressLine1?.message}>
                    <input
                        className={inputCls(errors.businessAddressLine1)}
                        placeholder="Nørrebrogade 42"
                        {...register('businessAddressLine1')}
                    />
                </Field>
                <Field label="Address line 2" error={errors.businessAddressLine2?.message}>
                    <input
                        className={inputCls(errors.businessAddressLine2)}
                        placeholder="Suite 3B"
                        {...register('businessAddressLine2')}
                    />
                </Field>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
                <Field label="City" required error={errors.businessCity?.message}>
                    <input
                        className={inputCls(errors.businessCity)}
                        placeholder="Copenhagen"
                        {...register('businessCity')}
                    />
                </Field>
                <Field label="State / region" required error={errors.businessState?.message}>
                    <input
                        className={inputCls(errors.businessState)}
                        placeholder="Hovedstaden"
                        {...register('businessState')}
                    />
                </Field>
                <Field label="Postal code" required error={errors.businessZip?.message}>
                    <input
                        className={inputCls(errors.businessZip)}
                        placeholder="2200"
                        {...register('businessZip')}
                    />
                </Field>
                <Field label="Country (ISO-2)" required error={errors.businessCountry?.message}>
                    <input
                        maxLength={2}
                        className={inputCls(errors.businessCountry)}
                        placeholder="DK"
                        {...register('businessCountry')}
                    />
                </Field>
            </div>

            <FormActions
                onSaveDraft={() => onSaveDraft(watch())}
                onBack={onBack}
                isBusy={isBusy}
                isSavingDraft={isSavingDraft}
                isSubmitting={isSubmitting}
                submitLabel="Save & continue"
            />
        </form>
    );
}