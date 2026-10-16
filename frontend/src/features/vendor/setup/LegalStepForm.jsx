import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Field, inputCls, FormActions } from './fields';

const BUSINESS_TYPES = [
    ['sole_proprietor', 'Sole Proprietor'],
    ['partnership',     'Partnership'],
    ['llc',             'LLC'],
    ['corporation',     'Corporation'],
    ['cooperative',     'Cooperative'],
    ['other',           'Other'],
];

const legalSchema = yup.object({
    legalBusinessName: yup
        .string()
        .trim()
        .required('Registered legal name is required')
        .max(255, 'Legal name is too long'),
    businessType: yup
        .string()
        .oneOf(BUSINESS_TYPES.map(([v]) => v), 'Select a business type')
        .required('Business type is required'),
    businessRegistrationNo: yup
        .string()
        .trim()
        .required('Business registration number is required')
        .max(100),
    taxId: yup
        .string()
        .trim()
        .required('Tax ID / TIN is required')
        .max(100),
    vatNumber: yup.string().trim().max(50).optional(),
});

export default function LegalStepForm({
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
        resolver: yupResolver(legalSchema),
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
            <Field
                label="Registered legal business name"
                required
                hint="Must match the name on your registration certificate."
                error={errors.legalBusinessName?.message}
            >
                <input
                    className={inputCls(errors.legalBusinessName)}
                    placeholder="Nordic Oak Studios ApS"
                    {...register('legalBusinessName')}
                />
            </Field>

            <Field label="Business type" required error={errors.businessType?.message}>
                <select className={inputCls(errors.businessType)} {...register('businessType')}>
                    <option value="">Select a type…</option>
                    {BUSINESS_TYPES.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <Field
                    label="Business registration no."
                    required
                    hint="Trade license / company number"
                    error={errors.businessRegistrationNo?.message}
                >
                    <input
                        className={inputCls(errors.businessRegistrationNo)}
                        placeholder="CPH-REG-2024-8812"
                        {...register('businessRegistrationNo')}
                    />
                </Field>
                <Field label="Tax ID / TIN" required error={errors.taxId?.message}>
                    <input
                        className={inputCls(errors.taxId)}
                        placeholder="DK-77291044"
                        {...register('taxId')}
                    />
                </Field>
            </div>

            <Field
                label="VAT number"
                hint="Optional — required in some regions"
                error={errors.vatNumber?.message}
            >
                <input
                    className={inputCls(errors.vatNumber)}
                    placeholder="DK-77291044"
                    {...register('vatNumber')}
                />
            </Field>

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