import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Icon from '../../../components/ui/Icon';
import { Field, inputCls, FormActions } from './fields';

const bankSchema = yup.object({
    bankAccountHolder: yup
        .string()
        .trim()
        .required('Account holder name is required')
        .max(255),
    bankAccountNumber: yup
        .string()
        .trim()
        .required('Account number is required')
        .max(255),
    bankName: yup
        .string()
        .trim()
        .required('Bank name is required')
        .max(255),
    bankRoutingNumber: yup.string().trim().max(100).optional(),
    bankIban:          yup.string().trim().max(50).optional(),
    bankSwift:         yup.string().trim().max(20).optional(),
});

export default function BankStepForm({
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
        resolver: yupResolver(bankSchema),
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
            <div className="rounded-lg bg-tertiary-fixed/50 p-space-sm flex items-start gap-space-sm">
                <Icon name="lock" size={18} className="text-on-tertiary-fixed mt-0.5 shrink-0" />
                <span className="text-body-sm text-on-tertiary-fixed">
                    Your bank details are used only for payouts. They are encrypted
                    at rest and never shown to customers.
                </span>
            </div>

            <Field label="Account holder name" required error={errors.bankAccountHolder?.message}>
                <input
                    className={inputCls(errors.bankAccountHolder)}
                    placeholder="Nordic Oak Studios ApS"
                    {...register('bankAccountHolder')}
                />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <Field label="Bank name" required error={errors.bankName?.message}>
                    <input
                        className={inputCls(errors.bankName)}
                        placeholder="Danske Bank"
                        {...register('bankName')}
                    />
                </Field>
                <Field label="Account number / IBAN" required error={errors.bankAccountNumber?.message}>
                    <input
                        className={inputCls(errors.bankAccountNumber)}
                        placeholder="DK50 0040 0440 1162 43"
                        {...register('bankAccountNumber')}
                    />
                </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                <Field label="Routing / Sort code" error={errors.bankRoutingNumber?.message}>
                    <input
                        className={inputCls(errors.bankRoutingNumber)}
                        placeholder="0040"
                        {...register('bankRoutingNumber')}
                    />
                </Field>
                <Field label="IBAN (if separate)" error={errors.bankIban?.message}>
                    <input
                        className={inputCls(errors.bankIban)}
                        placeholder="DK5000400440116243"
                        {...register('bankIban')}
                    />
                </Field>
                <Field label="SWIFT / BIC" error={errors.bankSwift?.message}>
                    <input
                        className={inputCls(errors.bankSwift)}
                        placeholder="DABADKKK"
                        {...register('bankSwift')}
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