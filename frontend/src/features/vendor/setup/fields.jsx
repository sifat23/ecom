export function Field({ label, error, hint, required, children }) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-label-md text-on-surface font-semibold flex items-center gap-1">
                {label}
                {required && <span className="text-secondary">*</span>}
            </span>
            {children}
            {hint && <span className="text-body-sm text-on-surface-variant">{hint}</span>}
            {error && <span className="text-body-sm text-error">{error}</span>}
        </label>
    );
}

export const inputCls = (err) =>
    `w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-colors text-body-md ${
        err ? 'ring-2 ring-error/40' : ''
    }`;

/** Shared bottom action bar — draft button on the left, submit on the right. */
export function FormActions({ onSaveDraft, onBack, isBusy, isSavingDraft, isSubmitting, submitLabel }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-sm border-t border-outline-variant/40">
            <div className="flex items-center gap-2">
                {onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={isBusy}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container-low px-4 py-2.5 text-label-md font-semibold text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Back
                    </button>
                )}
                {onSaveDraft && (
                    <button
                        type="button"
                        onClick={onSaveDraft}
                        disabled={isBusy}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container-low px-4 py-2.5 text-label-md font-semibold text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSavingDraft ? 'Saving…' : 'Save draft'}
                    </button>
                )}
            </div>

            <button
                type="submit"
                disabled={isBusy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-container text-on-primary px-5 py-2.5 text-label-md font-bold shadow-sm hover:bg-primary disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
                {isSubmitting ? 'Submitting…' : submitLabel}
                <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                    {isSubmitting ? 'progress_activity' : 'arrow_forward'}
                </span>
            </button>
        </div>
    );
}