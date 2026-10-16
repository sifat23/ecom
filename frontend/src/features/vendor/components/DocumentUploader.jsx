import { useRef, useState } from 'react';
import Icon from '../../../components/ui/Icon';
import { useUploadVendorDocumentMutation } from '../vendorApi';

const DOC_CATALOG = [
    { type: 'business_registration', label: 'Business Registration Certificate', required: true,  hint: 'Trade license or certificate of incorporation' },
    { type: 'tax_certificate',       label: 'Tax ID / TIN Certificate',           required: true,  hint: 'Official TIN or EIN document' },
    { type: 'national_id',           label: "Owner's National ID / Passport",    required: true,  hint: 'Government-issued photo ID' },
    { type: 'tax_clearance',         label: 'Tax Clearance Certificate',          required: false, hint: 'Recent clearance letter (if applicable)' },
    { type: 'bank_statement',        label: 'Bank Statement / Proof of Account',  required: true,  hint: 'Last 3 months, or voided check' },
    { type: 'store_logo',            label: 'Store Logo',                         required: false, hint: 'Square PNG/JPG, min 400×400' },
    { type: 'product_photo',         label: 'Product Sample Photo',               required: false, hint: 'One representative product photo' },
];

export default function DocumentUploader({ documents, onChange }) {
    const [uploadDoc] = useUploadVendorDocumentMutation();
    const [busyType, setBusyType] = useState(null);
    const [error, setError] = useState(null);
    const inputsRef = useRef({});

    const byType = (t) => documents.find((d) => d.type === t);

    const handleFile = async (type, file) => {
        if (!file) return;
        setError(null);
        setBusyType(type);
        try {
            const res = await uploadDoc({ file, documentType: type }).unwrap();
            const uploaded = res.data.document;
            // Replace existing doc of the same type
            const next = documents.filter((d) => d.type !== type).concat(uploaded);
            onChange(next);
        } catch (err) {
            setError(err?.data?.error?.message || 'Upload failed. Try again.');
        } finally {
            setBusyType(null);
            if (inputsRef.current[type]) inputsRef.current[type].value = '';
        }
    };

    const removeDoc = (type) => {
        onChange(documents.filter((d) => d.type !== type));
    };

    return (
        <div className="flex flex-col gap-space-md">
            {error && (
                <div className="rounded-lg bg-error-container/60 px-3 py-2 text-body-sm text-on-error-container">
                    {error}
                </div>
            )}

            {DOC_CATALOG.map((cat) => {
                const doc = byType(cat.type);
                const busy = busyType === cat.type;

                return (
                    <div
                        key={cat.type}
                        className={`rounded-xl border p-space-md transition-colors ${
                            doc
                                ? 'border-primary-container/40 bg-primary-fixed/20'
                                : cat.required
                                    ? 'border-outline-variant bg-surface-container-lowest'
                                    : 'border-outline-variant/60 bg-surface-container-lowest'
                        }`}
                    >
                        <div className="flex items-start justify-between gap-space-md">
                            <div className="flex items-start gap-space-sm min-w-0">
                                <div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                        doc
                                            ? 'bg-primary-container text-on-primary'
                                            : 'bg-surface-container text-on-surface-variant'
                                    }`}
                                >
                                    <Icon name={doc ? 'check' : 'upload_file'} size={20} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-label-lg text-on-surface font-bold">
                                            {cat.label}
                                        </span>
                                        {cat.required && (
                                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-secondary/15 text-secondary">
                                                Required
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-body-sm text-on-surface-variant mt-0.5">
                                        {cat.hint}
                                    </span>

                                    {doc && (
                                        <div className="mt-2 flex items-center gap-space-xs text-body-sm">
                                            <Icon name={doc.fileType === 'pdf' ? 'picture_as_pdf' : 'image'} size={16} className="text-primary" />
                                            <span className="text-on-surface font-medium truncate max-w-[280px]">
                                                {doc.name}
                                            </span>
                                            <span className="text-outline">·</span>
                                            <span className="text-on-surface-variant">{doc.fileSize}</span>
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-primary font-semibold hover:underline ml-1"
                                            >
                                                View
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                {doc ? (
                                    <button
                                        type="button"
                                        onClick={() => removeDoc(cat.type)}
                                        className="px-3 py-1.5 rounded-lg text-label-md font-semibold text-error bg-error-container/40 hover:bg-error-container/60 transition-colors"
                                    >
                                        Remove
                                    </button>
                                ) : (
                                    <>
                                        <input
                                            ref={(el) => (inputsRef.current[cat.type] = el)}
                                            type="file"
                                            accept="application/pdf,image/jpeg,image/png,image/webp"
                                            className="hidden"
                                            onChange={(e) => handleFile(cat.type, e.target.files?.[0])}
                                        />
                                        <button
                                            type="button"
                                            disabled={busy}
                                            onClick={() => inputsRef.current[cat.type]?.click()}
                                            className="px-3 py-1.5 rounded-lg text-label-md font-semibold bg-primary-container text-on-primary hover:bg-primary transition-colors disabled:opacity-60"
                                        >
                                            {busy ? 'Uploading…' : 'Upload'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            <div className="rounded-lg bg-surface-container-low p-space-sm flex items-start gap-space-sm text-body-sm text-on-surface-variant">
                <Icon name="info" size={16} className="text-primary mt-0.5 shrink-0" />
                <span>
                    Files must be PDF, JPG, PNG or WebP, up to 10 MB each. Uploaded documents
                    are visible only to platform admins during review.
                </span>
            </div>
        </div>
    );
}