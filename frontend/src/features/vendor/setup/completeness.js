/**
 * Single source of truth for "is the vendor setup finished?".
 *
 * Both the pending page and the setup wizard read from this list.
 * When you add a new step in the wizard, uncomment the matching
 * entry here and the pending page will automatically start
 * flagging it as incomplete until it's filled in.
 */
export const REQUIRED_DOCUMENT_TYPES = [
    'business_registration',
    'tax_certificate',
    'national_id',
    'bank_statement',
];

export const SETUP_STEPS = [
    {
        id: 'store',
        label: 'Storefront',
        icon: 'storefront',
        isComplete: (v) => Boolean(v?.businessName && v?.businessDescription),
    },
    {
        id: 'legal',
        label: 'Legal & Tax',
        icon: 'gavel',
        isComplete: (v) =>
            Boolean(
                v?.legalBusinessName &&
                v?.businessType &&
                v?.businessRegistrationNo &&
                v?.taxId
            ),
    },

    {
        id: 'contact',
        label: 'Contact & Address',
        icon: 'contact_mail',
        isComplete: (v) =>
            Boolean(
                v?.businessPhone &&
                v?.businessEmail &&
                v?.businessAddressLine1 &&
                v?.businessCity &&
                v?.businessState &&
                v?.businessZip &&
                v?.businessCountry
            ),
    },
    {
        id: 'bank',
        label: 'Payouts',
        icon: 'account_balance',
        isComplete: (v) =>
            Boolean(v?.bankAccountHolder && v?.bankName && v?.bankAccountNumber),
    },
    {
        id: 'documents',
        label: 'Documents',
        icon: 'folder_open',
        isComplete: (v) => {
            const types = new Set((v?.documents || []).map((d) => d.type));
            return REQUIRED_DOCUMENT_TYPES.every((t) => types.has(t));
        },
    },
];

/**
 * @returns {{
 *   steps: Array<{ id, label, icon, complete: boolean }>,
 *   completedCount: number,
 *   totalCount: number,
 *   isComplete: boolean,
 * }}
 */
export function getSetupStatus(vendor) {
    const steps = SETUP_STEPS.map((s) => ({
        id: s.id,
        label: s.label,
        icon: s.icon,
        complete: s.isComplete(vendor),
    }));
    const completedCount = steps.filter((s) => s.complete).length;
    return {
        steps,
        completedCount,
        totalCount: steps.length,
        isComplete: completedCount === steps.length,
    };
}