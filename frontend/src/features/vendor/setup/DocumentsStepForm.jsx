import Icon from '../../../components/ui/Icon';
import DocumentUploader from './DocumentUploader';
import { getSetupStatus } from './completeness';

export default function DocumentsStepForm({ onNext, onBack, isSubmitting }) {
    const status = getSetupStatus(null); // for the type-checking of steps; documents handled below
    // We compute readiness by asking the uploader to expose it — see note below.

    return (
        <div className="rounded-2xl bg-surface-container-lowest shadow-sm p-space-lg md:p-space-xl flex flex-col gap-space-md">
            <div className="flex flex-col gap-space-xs">
                <h3 className="font-headline-sm font-bold text-on-surface">
                    Verification documents
                </h3>
                <p className="text-body-md text-on-surface-variant">
                    Upload clear scans or photos. An admin can't approve your store without
                    these files.
                </p>
            </div>

            <DocumentUploader />

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
                    onClick={onNext}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary-container text-on-primary px-5 py-2.5 text-label-md font-bold shadow-sm hover:bg-primary disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                    Continue to review
                    <Icon name="arrow_forward" size={16} />
                </button>
            </div>
        </div>
    );
}