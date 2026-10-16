import Icon from '../../../components/ui/Icon';
import { REQUIRED_DOCUMENT_TYPES, SETUP_STEPS } from './completeness';

export default function ReviewStepForm({
    vendor,
    onJump,
    onSubmit,
    onBack,
    isSubmitting,
    error,
}) {
    const docs = Array.isArray(vendor?.documents) ? vendor.documents : [];

    const sectionRows = {
        store: [
            ['Store name', vendor?.businessName],
            ['Description', vendor?.businessDescription],
        ],
        legal: [
            ['Legal name', vendor?.legalBusinessName],
            ['Business type', (vendor?.businessType || '').replace(/_/g, ' ')],
            ['Registration no.', vendor?.businessRegistrationNo],
            ['Tax ID / TIN', vendor?.taxId],
            ['VAT number', vendor?.vatNumber || '—'],
        ],
        contact: [
            ['Phone', vendor?.businessPhone],
            ['Email', vendor?.businessEmail],
            ['Website', vendor?.website || '—'],
            [
                'Address',
                [
                    vendor?.businessAddressLine1,
                    vendor?.businessAddressLine2,
                    vendor?.businessCity,
                    vendor?.businessState,
                    vendor?.businessZip,
                    vendor?.businessCountry,
                ]
                    .filter(Boolean)
                    .join(', '),
            ],
            ['Years in business', vendor?.yearsInBusiness ?? '—'],
            ['Employees', vendor?.employeeCount ?? '—'],
        ],
        bank: [
            ['Account holder', vendor?.bankAccountHolder],
            ['Bank', vendor?.bankName],
            ['Account', vendor?.bankAccountNumber],
            ['Routing', vendor?.bankRoutingNumber || '—'],
            ['SWIFT / BIC', vendor?.bankSwift || '—'],
        ],
    };

    // Required-docs check
    const haveTypes = new Set(docs.map((d) => d.type));
    const missingDocs = REQUIRED_DOCUMENT_TYPES.filter((t) => !haveTypes.has(t));

    // Step-completeness check
    const steps = SETUP_STEPS.map((s) => ({
        id: s.id,
        label: s.label,
        complete: s.isComplete(vendor),
    }));
    const incompleteSteps = steps.filter((s) => !s.complete);

    const canSubmit = incompleteSteps.length === 0 && missingDocs.length === 0;

    return (
        <div className="rounded-2xl bg-surface-container-lowest shadow-sm p-space-lg md:p-space-xl flex flex-col gap-space-lg">
            <div className="rounded-lg bg-primary-fixed/40 p-space-sm flex items-start gap-space-sm">
                <Icon name="fact_check" size={18} className="text-on-primary-fixed mt-0.5 shrink-0" />
                <span className="text-body-sm text-on-primary-fixed">
                    Review everything carefully. Once submitted, an admin will verify your
                    documents before your store goes live.
                </span>
            </div>

            {/* Incomplete alerts */}
            {incompleteSteps.length > 0 && (
                <div className="rounded-lg bg-error-container/60 px-4 py-3 flex items-start gap-2.5">
                    <Icon name="error" size={18} className="text-on-error-container mt-0.5 shrink-0" />
                    <div className="flex flex-col gap-1">
                        <span className="text-body-sm font-semibold text-on-error-container">
                            Some sections aren't finished yet
                        </span>
                        <ul className="text-body-sm text-on-error-container/90 list-disc pl-4">
                            {incompleteSteps.map((s) => (
                                <li key={s.id}>{s.label}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {missingDocs.length > 0 && (
                <div className="rounded-lg bg-error-container/60 px-4 py-3 flex items-start gap-2.5">
                    <Icon name="error" size={18} className="text-on-error-container mt-0.5 shrink-0" />
                    <div className="flex flex-col gap-1">
                        <span className="text-body-sm font-semibold text-on-error-container">
                            Required documents missing
                        </span>
                        <ul className="text-body-sm text-on-error-container/90 list-disc pl-4">
                            {missingDocs.map((t) => (
                                <li key={t}>{t.replace(/_/g, ' ')}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Section summaries */}
            {Object.entries(sectionRows).map(([key, rows]) => (
                <section key={key} className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                        <h3 className="font-headline-sm font-bold text-on-surface capitalize">
                            {key === 'store'   && 'Storefront'}
                            {key === 'legal'   && 'Legal & Tax'}
                            {key === 'contact' && 'Contact & Address'}
                            {key === 'bank'    && 'Payouts'}
                        </h3>
                        <button
                            type="button"
                            onClick={() => onJump(key)}
                            className="text-label-md font-semibold text-primary-container hover:underline"
                        >
                            Edit
                        </button>
                    </div>
                    <dl className="rounded-lg bg-surface-container-low divide-y divide-outline-variant/40">
                        {rows.map(([label, value]) => (
                            <div
                                key={label}
                                className="grid grid-cols-3 gap-space-md px-3 py-2 text-body-sm"
                            >
                                <dt className="text-on-surface-variant col-span-1">{label}</dt>
                                <dd className="text-on-surface col-span-2 break-words">
                                    {value || '—'}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            ))}

            {/* Documents summary */}
            <section className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                    <h3 className="font-headline-sm font-bold text-on-surface">
                        Documents ({docs.length})
                    </h3>
                    <button
                        type="button"
                        onClick={() => onJump('documents')}
                        className="text-label-md font-semibold text-primary-container hover:underline"
                    >
                        Edit
                    </button>
                </div>
                <div className="rounded-lg bg-surface-container-low divide-y divide-outline-variant/40">
                    {docs.length === 0 ? (
                        <div className="px-3 py-3 text-body-sm text-on-surface-variant">
                            No documents uploaded yet.
                        </div>
                    ) : (
                        docs.map((d) => (
                            <div
                                key={d.id}
                                className="flex items-center justify-between gap-space-sm px-3 py-2"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <Icon
                                        name={d.fileType === 'pdf' ? 'picture_as_pdf' : 'image'}
                                        size={16}
                                        className="text-primary"
                                    />
                                    <span className="text-body-sm text-on-surface font-medium truncate">
                                        {d.label}
                                    </span>
                                </div>
                                <span className="text-body-sm text-on-surface-variant truncate max-w-[200px]">
                                    {d.name}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Error from server */}
            {error && (
                <div className="rounded-lg bg-error-container/60 px-3 py-2.5 text-body-sm text-on-error-container flex items-start gap-2">
                    <Icon name="error" size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-space-md pt-space-sm border-t border-outline-variant/40">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container-low px-4 py-2.5 text-label-md font-semibold text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <Icon name="arrow_back" size={16} />
                    Back
                </button>
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={!canSubmit || isSubmitting}
                    title={!canSubmit ? 'Complete all steps and upload required documents to submit' : undefined}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary-container text-on-primary px-5 py-2.5 text-label-md font-bold shadow-sm hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? 'Submitting…' : 'Submit application'}
                    <Icon
                        name={isSubmitting ? 'progress_activity' : 'task_alt'}
                        size={16}
                        className={isSubmitting ? 'animate-spin' : ''}
                    />
                </button>
            </div>
        </div>
    );
}