import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '../../auth/AuthFormShell';
import Button from '../../../components/ui/Button';
// import { vendorRegisterSchema } from '../schemas';
// import { useRegisterVendorMutation } from '../vendorApi';
import { Navigate } from 'react-router-dom';

export default function VendorRegisterPage() {

    return <Navigate to="/vendor/setup" replace />;

    // const navigate = useNavigate();
    // const [registerVendor, { isLoading, error }] = useRegisterVendorMutation();

    // const { register, handleSubmit, formState: { errors } } = useForm({
    //     resolver: yupResolver(vendorRegisterSchema),
    //     mode: 'onBlur',
    // });

    // const onSubmit = async (values) => {
    //     try {
    //         await registerVendor(values).unwrap();
    //         navigate('/sell/onboarding');
    //     } catch (_) { /* error is rendered below */ }
    // };

    // return (
    //     <div className="mx-auto max-w-[640px] px-margin-mobile py-space-xl">
    //         <h1 className="text-headline-lg text-on-surface">Tell us about your business</h1>
    //         <p className="mt-space-xs text-body-md text-on-surface-variant">
    //             We'll use this to review your application. You must already be signed up as a vendor account.
    //         </p>

    //         <form onSubmit={handleSubmit(onSubmit)} className="mt-space-lg space-y-space-md">
    //             <FormInput label="Business name" {...register('businessName')} error={errors.businessName?.message} />
    //             <FormInput label="Description"   {...register('businessDescription')} error={errors.businessDescription?.message} />
    //             <FormInput label="Registration no. (optional)" {...register('businessRegistrationNo')} error={errors.businessRegistrationNo?.message} />
    //             <FormInput label="Tax ID / EIN (optional)"     {...register('taxId')} error={errors.taxId?.message} />
    //             <FormInput label="Phone (optional)"            {...register('phone')} error={errors.phone?.message} />

    //             {error && (
    //                 <p className="text-body-md text-error">
    //                     {error?.data?.error?.message ?? 'Something went wrong. Try again.'}
    //                 </p>
    //             )}

    //             <Button type="submit" variant="primary" disabled={isLoading}>
    //                 {isLoading ? 'Submitting…' : 'Submit application'}
    //             </Button>
    //         </form>
    //     </div>
    // );
}