import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import Icon from '../../../components/ui/Icon';
import StoreStepForm from '../setup/StoreStepForm';
import LegalStepForm from '../setup/LegalStepForm';
import ContactStepForm from '../setup/ContactStepForm';
import BankStepForm from '../setup/BankStepForm';
import DocumentsStepForm from '../setup/DocumentsStepForm';
import ReviewStepForm from '../setup/ReviewStepForm';
import {
    useGetMyVendorQuery,
    useSaveStoreDraftMutation,
    useSubmitStoreStepMutation,
    useSaveLegalDraftMutation,
    useSubmitLegalStepMutation,
    useSaveContactDraftMutation,
    useSubmitContactStepMutation,
    useSaveBankDraftMutation,
    useSubmitBankStepMutation,
    useSubmitFullApplicationMutation,
} from '../vendorApi';

const STEPS = [
    { id: 'store', label: 'Storefront' },
    { id: 'legal', label: 'Legal & Tax' },
    { id: 'contact', label: 'Contact & Address' },
    { id: 'bank', label: 'Payouts' },
    { id: 'documents', label: 'Documents' },
    { id: 'review', label: 'Review' },
];

const STEP_STORAGE_KEY = 'vendor-setup:stepIdx';

/* ── Helpers ──────────────────────────────────────────── */

function buildDefaults(vendor) {
    return {
        businessName: vendor?.businessName ?? '',
        businessDescription: vendor?.businessDescription ?? '',

        legalBusinessName: vendor?.legalBusinessName ?? '',
        businessType: vendor?.businessType ?? '',
        businessRegistrationNo: vendor?.businessRegistrationNo ?? '',
        taxId: vendor?.taxId ?? '',
        vatNumber: vendor?.vatNumber ?? '',

        // ── Step 3 ──
        businessPhone: vendor?.businessPhone ?? '',
        businessEmail: vendor?.businessEmail ?? '',
        website: vendor?.website ?? '',
        yearsInBusiness: vendor?.yearsInBusiness ?? '',
        employeeCount: vendor?.employeeCount ?? '',
        businessAddressLine1: vendor?.businessAddressLine1 ?? '',
        businessAddressLine2: vendor?.businessAddressLine2 ?? '',
        businessCity: vendor?.businessCity ?? '',
        businessState: vendor?.businessState ?? '',
        businessZip: vendor?.businessZip ?? '',
        businessCountry: vendor?.businessCountry ?? '',

        // ── Step 4 ──
        bankAccountHolder: vendor?.bankAccountHolder ?? '',
        bankAccountNumber: vendor?.bankAccountNumber ?? '',
        bankName: vendor?.bankName ?? '',
        bankRoutingNumber: vendor?.bankRoutingNumber ?? '',
        bankIban: vendor?.bankIban ?? '',
        bankSwift: vendor?.bankSwift ?? '',
    };
}

/** Drops empty-string / null keys before sending a draft. */
function compact(values) {
    const out = {};
    for (const [k, v] of Object.entries(values)) {
        if (v === '' || v === null || v === undefined) continue;
        out[k] = v;
    }
    return out;
}

/** Picks the right starting step based on what's already saved. */
function resolveStartStep(data) {
    if (!data.businessName) return 0;
    if (!data.legalBusinessName) return 1;
    if (!data.businessEmail) return 2;
    if (!data.bankAccountHolder) return 3;

    // Documents + review are driven by the review page's own checks.
    const saved = Number(localStorage.getItem(STEP_STORAGE_KEY));
    if (Number.isInteger(saved) && saved >= 0 && saved < STEPS.length) return saved;
    return 4;
}

/* ── Page ─────────────────────────────────────────────── */

export default function VendorSetupPage() {
    const navigate = useNavigate();

    const { data, isLoading } = useGetMyVendorQuery();
    const [saveStoreDraft] = useSaveStoreDraftMutation();
    const [submitStoreStep, { isLoading: isSubmittingStore }] = useSubmitStoreStepMutation();
    const [saveLegalDraft] = useSaveLegalDraftMutation();
    const [submitLegalStep, { isLoading: isSubmittingLegal }] = useSubmitLegalStepMutation();
    const [saveContactDraft] = useSaveContactDraftMutation();
    const [submitContactStep, { isLoading: isSubmittingContact }] = useSubmitContactStepMutation();
    const [saveBankDraft] = useSaveBankDraftMutation();
    const [submitBankStep, { isLoading: isSubmittingBank }] = useSubmitBankStepMutation();
    const [submitApplication, { isLoading: isFinalSubmitting }] = useSubmitFullApplicationMutation();

    const existing = data?.data?.vendor;

    const [formData, setFormData] = useState(() => buildDefaults(null));
    const [stepIdx, setStepIdx] = useState(0);
    const [hydrated, setHydrated] = useState(false);
    const [restored, setRestored] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [successMsg, setSuccessMsg] = useState(null);
    const [submitError, setSubmitError] = useState(null);

    const hydrateOnceRef = useRef(false);

    /* ── Hydrate once when the query first resolves ─────── */
    useEffect(() => {
        if (isLoading || hydrateOnceRef.current) return;

        const defaults = buildDefaults(existing);
        setFormData(defaults);
        setStepIdx(resolveStartStep(defaults));
        setRestored(Boolean(defaults.businessName || defaults.legalBusinessName));

        hydrateOnceRef.current = true;
        setHydrated(true);
    }, [isLoading, existing]);

    /* ── Persist current step for refresh recovery ──────── */
    useEffect(() => {
        if (!hydrated) return;
        localStorage.setItem(STEP_STORAGE_KEY, String(stepIdx));
    }, [stepIdx, hydrated]);

    /* ── Flash helpers ──────────────────────────────────── */
    const flashSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(null), 2500);
    };

    const clearBanners = () => {
        setSubmitError(null);
        setSuccessMsg(null);
    };

    /* ── Step 1 ─────────────────────────────────────────── */
    const onSaveStoreDraft = async (values) => {
        clearBanners();
        setSavingDraft(true);
        try {
            await saveStoreDraft(compact(values)).unwrap();
            flashSuccess('Draft saved.');
        } catch (err) {
            setSubmitError(err?.data?.error?.message || 'Could not save draft.');
        } finally {
            setSavingDraft(false);
        }
    };

    const onStoreSubmit = async (values) => {
        clearBanners();
        try {
            await submitStoreStep(values).unwrap();
            setFormData((prev) => ({ ...prev, ...values }));
            setStepIdx(1);
        } catch (err) {
            setSubmitError(err?.data?.error?.message || 'Could not save step 1.');
        }
    };

    /* ── Step 2 ─────────────────────────────────────────── */
    const onSaveLegalDraft = async (values) => {
        clearBanners();
        setSavingDraft(true);
        try {
            await saveLegalDraft(compact(values)).unwrap();
            flashSuccess('Draft saved.');
        } catch (err) {
            setSubmitError(err?.data?.error?.message || 'Could not save draft.');
        } finally {
            setSavingDraft(false);
        }
    };

    const onLegalSubmit = async (values) => {
        clearBanners();
        try {
            await submitLegalStep(values).unwrap();
            setFormData((prev) => ({ ...prev, ...values }));
            setStepIdx(2);                      // → Contact & Address
        } catch (err) {
            setSubmitError(err?.data?.error?.message || 'Could not save step 2.');
        }
    };

    /* ── Step 3 ─────────────────────────────────────────── */

    const onSaveContactDraft = async (values) => {
        clearBanners();
        setSavingDraft(true);
        try {
            await saveContactDraft(compact(values)).unwrap();
            flashSuccess('Draft saved.');
        } catch (err) {
            setSubmitError(err?.data?.error?.message || 'Could not save draft.');
        } finally {
            setSavingDraft(false);
        }
    };

    const onContactSubmit = async (values) => {
        clearBanners();
        try {
            await submitContactStep(values).unwrap();
            setFormData((prev) => ({ ...prev, ...values }));
            setStepIdx(3);                      // → Payouts
        } catch (err) {
            setSubmitError(err?.data?.error?.message || 'Could not save step 3.');
        }
    };

    /* ── Step 4 ─────────────────────────────────────────── */

    const onSaveBankDraft = async (values) => {
        clearBanners();
        setSavingDraft(true);
        try {
            await saveBankDraft(compact(values)).unwrap();
            flashSuccess('Draft saved.');
        } catch (err) {
            setSubmitError(err?.data?.error?.message || 'Could not save draft.');
        } finally {
            setSavingDraft(false);
        }
    };

    const onBankSubmit = async (values) => {
        clearBanners();
        try {
            await submitBankStep(values).unwrap();
            setFormData((prev) => ({ ...prev, ...values }));
            setStepIdx(4);                      // → Documents
        } catch (err) {
            setSubmitError(err?.data?.error?.message || 'Could not save step 4.');
        }
    };

    /* ── Final submit ──────────────────────────────────── */

    const onFinalSubmit = async () => {
        clearBanners();
        try {
            await submitApplication().unwrap();
            localStorage.removeItem(STEP_STORAGE_KEY);
            navigate('/vendor/pending', { replace: true });
        } catch (err) {
            setSubmitError(err?.data?.error?.message || 'Could not submit application.');
        }
    };

    /* ── Loading gate ───────────────────────────────────── */
    if (isLoading || !hydrated) {
        return (
            <div className="mx-auto max-w-2xl px-margin-mobile py-space-xl">
                <div className="h-2 rounded-full bg-surface-container-low overflow-hidden">
                    <div className="h-full w-1/2 bg-primary-container animate-pulse" />
                </div>
            </div>
        );
    }

    const currentStep = STEPS[stepIdx];
    const STEP_ICONS = [
        'storefront',
        'gavel',
        'contact_mail',
        'account_balance',
        'folder_open',
        'fact_check',
    ];
    const isLastStep = stepIdx === STEPS.length - 1;

    return (
        <div className="mx-auto max-w-2xl px-margin-mobile md:px-margin-tablet py-space-xl flex flex-col gap-space-lg">

            {/* Header */}
            <header className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between gap-space-sm">
                    <Link
                        to="/vendor/pending"
                        className="text-label-md text-on-surface-variant hover:text-on-surface inline-flex items-center gap-1"
                    >
                        <Icon name="arrow_back" size={16} />
                        Back to status
                    </Link>
                    <span className="text-label-sm text-on-surface-variant">
                        Step {stepIdx + 1} of {STEPS.length}
                    </span>
                </div>
                <h1 className="text-headline-lg text-on-surface tracking-tight font-bold">
                    {existing?.businessName
                        ? 'Update your vendor setup'
                        : 'Set up your storefront'}
                </h1>
                <p className="text-body-md text-on-surface-variant">
                    {currentStep.id === 'store' && "Start with the basics. We'll ask for legal and payout details next."}
                    {currentStep.id === 'legal' && 'Now tell us about your registered business so we can verify you.'}
                    {currentStep.id === 'contact' && "Where can customers reach you, and where is the business physically located?"}
                    {currentStep.id === 'bank' && (
                        'Where should we send your payouts once your store is approved?'
                    )}
                    {currentStep.id === 'documents' && 'Upload the verification papers our admins need to approve your store.'}
                    {currentStep.id === 'review' && 'One last look. Submit when everything looks right.'}
                </p>
            </header>

            {/* Step rail */}
            <ol className="flex flex-wrap items-center gap-1.5">
                {STEPS.map((s, i) => {
                    const active = i === stepIdx;
                    const done = i < stepIdx;
                    const clickable = i <= stepIdx;

                    return (
                        <li key={s.id} className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => clickable && setStepIdx(i)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-label-sm font-bold transition-colors ${active
                                    ? 'bg-primary-container text-on-primary'
                                    : done
                                        ? 'bg-primary-fixed text-on-primary-fixed'
                                        : 'bg-surface-container text-on-surface-variant'
                                    } ${clickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                            >
                                <Icon name={done ? 'check' : (STEP_ICONS[i] ?? 'circle')} size={14} />
                                {s.label}
                            </button>
                            {i < STEPS.length - 1 && <span className="text-outline-variant">·</span>}
                        </li>
                    );
                })}
            </ol>

            {/* Restored banner */}
            {restored && stepIdx === 0 && (
                <div className="rounded-lg bg-primary-fixed/40 px-4 py-3 flex items-start gap-2.5">
                    <Icon name="history" size={18} className="text-on-primary-fixed mt-0.5 shrink-0" />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-body-sm font-semibold text-on-primary-fixed">
                            We restored your saved progress
                        </span>
                        <span className="text-body-sm text-on-primary-fixed/80">
                            Everything you entered before is still here.
                        </span>
                    </div>
                </div>
            )}

            {/* Flash banners */}
            {submitError && (
                <div className="rounded-lg bg-error-container/60 px-3 py-2.5 text-body-sm text-on-error-container flex items-start gap-2">
                    <Icon name="error" size={16} className="mt-0.5 shrink-0" />
                    <span>{submitError}</span>
                </div>
            )}
            {successMsg && (
                <div className="rounded-lg bg-primary-fixed/40 px-3 py-2.5 text-body-sm text-on-primary-fixed flex items-start gap-2">
                    <Icon name="check_circle" size={16} className="mt-0.5 shrink-0" />
                    <span>{successMsg}</span>
                </div>
            )}

            {/* Step body */}
            {currentStep.id === 'store' && (
                <StoreStepForm
                    initialValues={{
                        businessName: formData.businessName,
                        businessDescription: formData.businessDescription,
                    }}
                    onSubmit={onStoreSubmit}
                    onSaveDraft={onSaveStoreDraft}
                    isSavingDraft={savingDraft}
                    isSubmitting={isSubmittingStore}
                />
            )}

            {currentStep.id === 'legal' && (
                <LegalStepForm
                    initialValues={{
                        legalBusinessName: formData.legalBusinessName,
                        businessType: formData.businessType,
                        businessRegistrationNo: formData.businessRegistrationNo,
                        taxId: formData.taxId,
                        vatNumber: formData.vatNumber,
                    }}
                    onSubmit={onLegalSubmit}
                    onSaveDraft={onSaveLegalDraft}
                    onBack={() => setStepIdx(0)}
                    isSavingDraft={savingDraft}
                    isSubmitting={isSubmittingLegal}
                />
            )}

            {currentStep.id === 'contact' && (
                <ContactStepForm
                    initialValues={{
                        businessPhone: formData.businessPhone,
                        businessEmail: formData.businessEmail,
                        website: formData.website,
                        yearsInBusiness: formData.yearsInBusiness,
                        employeeCount: formData.employeeCount,
                        businessAddressLine1: formData.businessAddressLine1,
                        businessAddressLine2: formData.businessAddressLine2,
                        businessCity: formData.businessCity,
                        businessState: formData.businessState,
                        businessZip: formData.businessZip,
                        businessCountry: formData.businessCountry,
                    }}
                    onSubmit={onContactSubmit}
                    onSaveDraft={onSaveContactDraft}
                    onBack={() => setStepIdx(1)}
                    isSavingDraft={savingDraft}
                    isSubmitting={isSubmittingContact}
                />
            )}

            {currentStep.id === 'bank' && (
                <BankStepForm
                    initialValues={{
                        bankAccountHolder: formData.bankAccountHolder,
                        bankAccountNumber: formData.bankAccountNumber,
                        bankName: formData.bankName,
                        bankRoutingNumber: formData.bankRoutingNumber,
                        bankIban: formData.bankIban,
                        bankSwift: formData.bankSwift,
                    }}
                    onSubmit={onBankSubmit}
                    onSaveDraft={onSaveBankDraft}
                    onBack={() => setStepIdx(2)}
                    isSavingDraft={savingDraft}
                    isSubmitting={isSubmittingBank}
                />
            )}

            {currentStep.id === 'documents' && (
                <DocumentsStepForm
                    onNext={() => setStepIdx(5)}
                    onBack={() => setStepIdx(3)}
                />
            )}

            {currentStep.id === 'review' && (
                <ReviewStepForm
                    vendor={existing}
                    onJump={(id) => {
                        const idx = STEPS.findIndex((s) => s.id === id);
                        if (idx >= 0) setStepIdx(idx);
                    }}
                    onSubmit={onFinalSubmit}
                    onBack={() => setStepIdx(4)}
                    isSubmitting={isFinalSubmitting}
                    error={submitError}
                />
            )}
        </div>
    );
}