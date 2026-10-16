import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Field, inputCls, FormActions } from './fields';

const storeSchema = yup.object({
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

export default function StoreStepForm({
    initialValues,
    onSubmit,
    onSaveDraft,
    isSavingDraft,
    isSubmitting,
}) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting: formSubmitting },
    } = useForm({
        resolver: yupResolver(storeSchema),
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
            <Field label="Store name" required error={errors.businessName?.message}>
                <input
                    className={inputCls(errors.businessName)}
                    placeholder="Nordic Oak Studios"
                    {...register('businessName')}
                />
            </Field>

            <Field
                label="Store description"
                required
                hint="Tell customers what you sell and what makes you unique."
                error={errors.businessDescription?.message}
            >
                <textarea
                    rows={5}
                    className={inputCls(errors.businessDescription)}
                    placeholder="Hand-turned Nordic oak horologes, minimalist clocks…"
                    {...register('businessDescription')}
                />
            </Field>

            <FormActions
                onSaveDraft={() => onSaveDraft(watch())}
                isBusy={isBusy}
                isSavingDraft={isSavingDraft}
                isSubmitting={isSubmitting}
                submitLabel="Save & continue"
            />
        </form>
    );
}