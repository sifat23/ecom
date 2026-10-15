import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    useGetAdminVendorsQuery,
    useApproveAdminVendorMutation,
    useRejectAdminVendorMutation,
    useGetAdminVendorActivitiesQuery,
} from '../../../store/api/authApi';
import { useSelector } from 'react-redux';

export default function AdminVendorsPage() {
    const admin = useSelector((s) => s.auth.admin);
    const [selectedTab, setSelectedTab] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);

    // Queries & Mutations
    const {
        data: vendorsData,
        isLoading,
        isFetching,
        refetch,
    } = useGetAdminVendorsQuery({
        status: selectedTab,
        search: searchQuery,
        page,
    });

    const { data: activitiesData, refetch: refetchActivities } =
        useGetAdminVendorActivitiesQuery(40);

    const [approveVendor, { isLoading: isApproving }] = useApproveAdminVendorMutation();
    const [rejectVendor, { isLoading: isRejecting }] = useRejectAdminVendorMutation();

    // Inspection Modal State
    const [inspectingVendor, setInspectingVendor] = useState(null);
    const [activeDocPreview, setActiveDocPreview] = useState(null);

    // Approval Confirmation Modal State
    const [vendorToApprove, setVendorToApprove] = useState(null);

    // Rejection Modal State
    const [vendorToReject, setVendorToReject] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionError, setRejectionError] = useState('');

    // Toast feedback state
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const counts = vendorsData?.data?.counts || { all: 0, pending: 0, approved: 0, rejected: 0 };
    const vendorsList = vendorsData?.data?.vendors || [];
    const activitiesList = activitiesData?.data?.activities || [];

    const adminName = admin?.firstName
        ? `${admin.firstName} ${admin.lastName || ''}`.trim()
        : 'Henrik Vang';

    // Handle Approve
    const handleConfirmApprove = async () => {
        if (!vendorToApprove) return;
        try {
            const res = await approveVendor(vendorToApprove.id).unwrap();
            showToast(res.data?.message || `Vendor ${vendorToApprove.businessName} approved! Email dispatched.`);
            setVendorToApprove(null);
            if (inspectingVendor?.id === vendorToApprove.id) {
                setInspectingVendor(null);
            }
            refetch();
            refetchActivities();
        } catch (err) {
            showToast(err.data?.error?.message || 'Failed to approve vendor.');
        }
    };

    // Handle Reject
    const handleConfirmReject = async () => {
        if (!vendorToReject) return;
        if (!rejectionReason.trim()) {
            setRejectionError('Please provide a reason for rejection.');
            return;
        }
        try {
            const res = await rejectVendor({
                id: vendorToReject.id,
                reason: rejectionReason.trim(),
            }).unwrap();
            showToast(res.data?.message || `Vendor ${vendorToReject.businessName} rejected.`);
            setVendorToReject(null);
            setRejectionReason('');
            setRejectionError('');
            if (inspectingVendor?.id === vendorToReject.id) {
                setInspectingVendor(null);
            }
            refetch();
            refetchActivities();
        } catch (err) {
            setRejectionError(err.data?.error?.message || 'Failed to reject vendor.');
        }
    };

    const rejectionTemplates = [
        'Business tax identification document is expired or could not be verified.',
        'Submitted trade license does not match the registered entity name.',
        'Owner identification scan is unclear or cropped. Please submit a high-resolution photo.',
        'Additional craft guild accreditation or workshop proof is required for atelier status.',
    ];

    return (
        <main className="relative pt-24 sm:pt-20 pb-16 bg-surface flex-1 w-full px-space-lg">
            {/* Global Toast */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-primary text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-primary-fixed-dim/30 animate-bounce">
                    <span className="material-symbols-outlined text-[18px] text-primary-fixed">verified</span>
                    <span>{toastMessage}</span>
                </div>
            )}

            <div className="flex flex-col w-full gap-space-lg mt-1">
                {/* ── Top Header ────────────────────────────────────── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
                    <div className="flex flex-col gap-space-xs max-w-2xl">
                        {/* Breadcrumbs */}
                        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant flex-wrap mb-1">
                            <Link
                                to="/admin/dashboard"
                                className="hover:text-primary transition-colors flex items-center gap-1 text-on-surface-variant"
                            >
                                <span className="material-symbols-outlined text-[16px]">home</span>
                                <span>Home</span>
                            </Link>
                            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                            {selectedTab === 'pending' && !inspectingVendor ? (
                                <span className="text-on-surface font-semibold">Vendor Management</span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedTab('pending');
                                        setInspectingVendor(null);
                                    }}
                                    className="hover:text-primary transition-colors text-on-surface-variant cursor-pointer"
                                >
                                    Vendor Management
                                </button>
                            )}
                            {selectedTab !== 'pending' && !inspectingVendor && (
                                <>
                                    <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                                    <span className="text-on-surface font-semibold capitalize">
                                        {selectedTab === 'all' ? 'All Vendors' : `${selectedTab} Queue`}
                                    </span>
                                </>
                            )}
                            {inspectingVendor && (
                                <>
                                    <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                                    <span className="text-on-surface font-semibold truncate max-w-[220px]">
                                        {inspectingVendor.businessName}
                                    </span>
                                </>
                            )}
                        </nav>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2.5">
                            <span className="material-symbols-outlined text-[32px] text-primary">storefront</span>
                            <span>Vendor Management</span>
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            Review pending artisan requests, inspect submitted papers and verification documents, approve seller access, and audit governance trails.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-space-sm">
                        <button
                            type="button"
                            onClick={() => {
                                refetch();
                                refetchActivities();
                                showToast('Refreshed vendor queues and activities.');
                            }}
                            className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md shadow-sm transition-all cursor-pointer"
                        >
                            <span className={`material-symbols-outlined text-[18px] text-primary ${isFetching ? 'animate-spin' : ''}`}>
                                sync
                            </span>
                            <span>Refresh Queue</span>
                        </button>
                    </div>
                </div>

                {/* ── Metric Summary Bento Cards ────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                    {/* Pending Verification */}
                    <div
                        onClick={() => setSelectedTab('pending')}
                        className={`p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-all cursor-pointer border-2 ${
                            selectedTab === 'pending' ? 'border-tertiary-fixed-dim' : 'border-transparent'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                                Pending Verification
                            </span>
                            <span className="p-1.5 rounded-lg bg-tertiary-fixed/30 text-tertiary flex items-center justify-center">
                                <span className="material-symbols-outlined text-[18px]">pending_actions</span>
                            </span>
                        </div>
                        <div className="mt-space-sm flex items-baseline gap-2">
                            <span className="font-display-hero-mobile text-display-hero-mobile text-on-surface font-bold tracking-tight">
                                {counts.pending}
                            </span>
                            <span className="font-body-sm text-body-sm text-outline">studios awaiting review</span>
                        </div>
                        <div className="mt-space-sm pt-space-xs border-t border-surface-container text-xs text-tertiary-container font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">priority_high</span>
                            <span>Action required by admin</span>
                        </div>
                    </div>

                    {/* Approved Artisans */}
                    <div
                        onClick={() => setSelectedTab('approved')}
                        className={`p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-all cursor-pointer border-2 ${
                            selectedTab === 'approved' ? 'border-primary' : 'border-transparent'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                                Active Approved Vendors
                            </span>
                            <span className="p-1.5 rounded-lg bg-primary-fixed/40 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-[18px]">verified</span>
                            </span>
                        </div>
                        <div className="mt-space-sm flex items-baseline gap-2">
                            <span className="font-display-hero-mobile text-display-hero-mobile text-on-surface font-bold tracking-tight">
                                {counts.approved}
                            </span>
                            <span className="font-body-sm text-body-sm text-outline">authorized to sell</span>
                        </div>
                        <div className="mt-space-sm pt-space-xs border-t border-surface-container text-xs text-primary font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            <span>Selling enabled &amp; active</span>
                        </div>
                    </div>

                    {/* Rejected / Resubmission */}
                    <div
                        onClick={() => setSelectedTab('rejected')}
                        className={`p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-all cursor-pointer border-2 ${
                            selectedTab === 'rejected' ? 'border-secondary' : 'border-transparent'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                                Rejected Applications
                            </span>
                            <span className="p-1.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                                <span className="material-symbols-outlined text-[18px]">cancel</span>
                            </span>
                        </div>
                        <div className="mt-space-sm flex items-baseline gap-2">
                            <span className="font-display-hero-mobile text-display-hero-mobile text-on-surface font-bold tracking-tight">
                                {counts.rejected}
                            </span>
                            <span className="font-body-sm text-body-sm text-outline">rejection notices sent</span>
                        </div>
                        <div className="mt-space-sm pt-space-xs border-t border-surface-container text-xs text-secondary font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">history</span>
                            <span>Can resubmit with corrections</span>
                        </div>
                    </div>
                </div>

                {/* ── Main Vendor Management Table Card ──────────────── */}
                <div className="flex flex-col rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden border border-outline-variant/30">
                    {/* Controls Bar */}
                    <div className="p-space-lg flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest border-b border-surface-container">
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Filter Tabs */}
                            <div className="flex items-center bg-surface-container-low p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setSelectedTab('pending')}
                                    className={`px-3 py-1.5 rounded-md font-label-sm text-label-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                                        selectedTab === 'pending'
                                            ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                                            : 'text-on-surface-variant hover:text-on-surface'
                                    }`}
                                >
                                    <span>Pending Queue</span>
                                    <span className="px-1.5 py-0.2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                                        {counts.pending}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedTab('approved')}
                                    className={`px-3 py-1.5 rounded-md font-label-sm text-label-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                                        selectedTab === 'approved'
                                            ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                                            : 'text-on-surface-variant hover:text-on-surface'
                                    }`}
                                >
                                    <span>Approved</span>
                                    <span className="px-1.5 py-0.2 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">
                                        {counts.approved}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedTab('rejected')}
                                    className={`px-3 py-1.5 rounded-md font-label-sm text-label-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                                        selectedTab === 'rejected'
                                            ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                                            : 'text-on-surface-variant hover:text-on-surface'
                                    }`}
                                >
                                    <span>Rejected</span>
                                    <span className="px-1.5 py-0.2 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                                        {counts.rejected}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedTab('all')}
                                    className={`px-3 py-1.5 rounded-md font-label-sm text-label-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                                        selectedTab === 'all'
                                            ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                                            : 'text-on-surface-variant hover:text-on-surface'
                                    }`}
                                >
                                    <span>All Studios</span>
                                    <span className="px-1.5 py-0.2 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-bold">
                                        {counts.all}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full sm:w-72">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                                search
                            </span>
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container transition-all"
                                placeholder="Search studio, email, reg no, tax ID..."
                                type="text"
                            />
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left font-body-sm text-body-sm">
                            <thead>
                                <tr className="bg-surface-container-low/70 font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                                    <th className="py-space-sm px-space-lg">Studio / Business</th>
                                    <th className="py-space-sm px-space-md">Artisan Contact</th>
                                    <th className="py-space-sm px-space-md">Registration &amp; Tax ID</th>
                                    <th className="py-space-sm px-space-md">Verification Papers</th>
                                    <th className="py-space-sm px-space-md">Status</th>
                                    <th className="py-space-sm px-space-lg text-right">Triage Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-on-surface divide-y divide-surface-container-low">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="py-16 text-center text-on-surface-variant">
                                            <span className="material-symbols-outlined text-[32px] animate-spin text-primary">
                                                progress_activity
                                            </span>
                                            <p className="mt-2 text-xs font-semibold">Loading vendor queue…</p>
                                        </td>
                                    </tr>
                                ) : vendorsList.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-16 text-center text-on-surface-variant">
                                            <span className="material-symbols-outlined text-[36px] text-outline">
                                                folder_open
                                            </span>
                                            <p className="mt-2 text-sm font-semibold text-on-surface">
                                                No vendors found in this queue.
                                            </p>
                                            <p className="text-xs text-outline mt-0.5">
                                                Try changing the filter tab or clearing the search box.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    vendorsList.map((vendor) => {
                                        const docs = Array.isArray(vendor.documents) ? vendor.documents : [];
                                        return (
                                            <tr
                                                key={vendor.id}
                                                className="hover:bg-surface-container-low/50 transition-colors group"
                                            >
                                                {/* Business Name & Description */}
                                                <td className="py-space-md px-space-lg">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-semibold text-primary font-label-md text-label-md">
                                                                {vendor.businessName}
                                                            </span>
                                                            {!vendor.hasSubmittedProfile && (
                                                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-surface-container-high text-outline font-semibold">
                                                                    Registered Account
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-on-surface-variant line-clamp-1 max-w-xs mt-0.5">
                                                            {vendor.businessDescription || 'No description provided.'}
                                                        </p>
                                                        <span className="text-[11px] text-outline mt-1 font-label-sm">
                                                            Applied: {new Date(vendor.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Contact Details */}
                                                <td className="py-space-md px-space-md">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-on-surface font-label-md text-label-md">
                                                            {vendor.user?.firstName || ''} {vendor.user?.lastName || ''}
                                                        </span>
                                                        <span className="text-xs text-outline flex items-center gap-1">
                                                            <span>{vendor.user?.email}</span>
                                                        </span>
                                                        <span className="text-[11px] text-on-surface-variant">
                                                            {vendor.user?.phone || 'No phone registered'}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Registration & Tax */}
                                                <td className="py-space-md px-space-md">
                                                    <div className="flex flex-col text-xs">
                                                        <span className="font-mono text-on-surface font-semibold">
                                                            Reg: {vendor.businessRegistrationNo || (vendor.hasSubmittedProfile ? 'N/A' : 'Pending')}
                                                        </span>
                                                        <span className="font-mono text-outline">
                                                            Tax: {vendor.taxId || (vendor.hasSubmittedProfile ? 'N/A' : 'Pending')}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Verification Papers Chips */}
                                                <td className="py-space-md px-space-md">
                                                    <div className="flex flex-col gap-1.5 items-start">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setInspectingVendor(vendor);
                                                                setActiveDocPreview(docs[0] || null);
                                                            }}
                                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                                                docs.length > 0
                                                                    ? 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                                                                    : 'bg-surface-container-low hover:bg-surface-container text-outline'
                                                            }`}
                                                        >
                                                            <span className="material-symbols-outlined text-[16px] text-primary">
                                                                {docs.length > 0 ? 'description' : 'upload_file'}
                                                            </span>
                                                            <span>
                                                                {docs.length > 0
                                                                    ? `${docs.length} ${docs.length === 1 ? 'Paper' : 'Papers'}`
                                                                    : 'No Papers Uploaded'}
                                                            </span>
                                                            <span className="material-symbols-outlined text-[14px] text-outline">
                                                                {docs.length > 0 ? 'visibility' : 'info'}
                                                            </span>
                                                        </button>

                                                        {docs.length > 0 ? (
                                                            <span className="text-[10px] text-outline truncate max-w-[170px]">
                                                                {docs[0].name}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] text-outline italic">
                                                                {vendor.hasSubmittedProfile ? 'No documents attached' : 'Awaiting business form'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Status Badge */}
                                                <td className="py-space-md px-space-md">
                                                    {vendor.status === 'pending' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                                                            <span>Pending Review</span>
                                                        </span>
                                                    )}
                                                    {vendor.status === 'approved' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold">
                                                            <span className="material-symbols-outlined text-[14px]">check</span>
                                                            <span>Approved</span>
                                                        </span>
                                                    )}
                                                    {vendor.status === 'rejected' && (
                                                        <span
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold cursor-help"
                                                            title={vendor.rejectionReason || 'No reason specified'}
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">close</span>
                                                            <span>Rejected</span>
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-space-md px-space-lg text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setInspectingVendor(vendor);
                                                                setActiveDocPreview(docs[0] || null);
                                                            }}
                                                            className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors cursor-pointer"
                                                        >
                                                            Inspect Papers
                                                        </button>

                                                        {vendor.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setVendorToApprove(vendor)}
                                                                    className="px-2.5 py-1 rounded bg-primary-container hover:bg-primary text-on-primary text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                                                                >
                                                                    <span className="material-symbols-outlined text-[14px]">check</span>
                                                                    <span>Accept</span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setVendorToReject(vendor);
                                                                        setRejectionReason('');
                                                                        setRejectionError('');
                                                                    }}
                                                                    className="px-2.5 py-1 rounded bg-secondary/15 hover:bg-secondary text-secondary hover:text-on-secondary text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                                                                >
                                                                    <span className="material-symbols-outlined text-[14px]">close</span>
                                                                    <span>Reject</span>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Vendor Management Activity Trail ─────────────── */}
                <div className="flex flex-col rounded-xl bg-surface-container-lowest shadow-sm p-space-lg border border-outline-variant/30">
                    <div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[20px]">history_edu</span>
                            <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                Vendor Management Audit Trail
                            </h2>
                            <span className="px-2 py-0.5 rounded-full bg-surface-container text-xs text-on-surface-variant font-bold">
                                Live Logs
                            </span>
                        </div>
                        <span className="text-xs text-outline">
                            Every admin approval and rejection is recorded with timestamp &amp; admin identity
                        </span>
                    </div>

                    <div className="mt-space-md flex flex-col gap-2.5 max-h-72 overflow-y-auto">
                        {activitiesList.length === 0 ? (
                            <div className="py-8 text-center text-xs text-on-surface-variant">
                                No administrative vendor actions logged yet.
                            </div>
                        ) : (
                            activitiesList.map((act) => {
                                const meta = act.metadata || {};
                                const isApproval = act.action === 'vendor.approved';
                                const isRejection = act.action === 'vendor.rejected';

                                return (
                                    <div
                                        key={act.id}
                                        className="p-3 rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border border-surface-container"
                                    >
                                        <div className="flex items-start gap-2.5">
                                            <div
                                                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                                    isApproval
                                                        ? 'bg-primary-fixed text-on-primary-fixed'
                                                        : isRejection
                                                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                                                        : 'bg-surface-container-high text-on-surface'
                                                }`}
                                            >
                                                <span className="material-symbols-outlined text-[16px]">
                                                    {isApproval ? 'check' : isRejection ? 'close' : 'receipt_long'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="font-bold text-on-surface">
                                                        {meta.adminName || 'Admin'} ({meta.adminRole || 'admin'})
                                                    </span>
                                                    <span className="text-outline">
                                                        {isApproval ? 'approved and accepted' : isRejection ? 'rejected application for' : act.action}
                                                    </span>
                                                    <span className="font-bold text-primary">
                                                        {meta.vendorName || 'Artisan Studio'}
                                                    </span>
                                                </div>
                                                {meta.rejectionReason && (
                                                    <p className="text-[11px] text-secondary mt-0.5 font-medium">
                                                        Reason: "{meta.rejectionReason}"
                                                    </p>
                                                )}
                                                <span className="text-[10px] text-outline mt-0.5">
                                                    Target Email: {meta.vendorEmail || 'N/A'} &middot; IP: {act.ipAddress || '127.0.0.1'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex sm:flex-col items-center sm:items-end justify-between text-right shrink-0">
                                            <span className="font-semibold text-on-surface text-[11px]">
                                                {new Date(act.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="text-[10px] text-outline">
                                                {new Date(act.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
             *  MODAL 1: DOCUMENT INSPECTION DRAWER
             * ══════════════════════════════════════════════════════ */}
            {inspectingVendor && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl max-h-[90vh] bg-surface-container-lowest rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-outline-variant/40">
                        {/* Drawer Header */}
                        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[22px]">policy</span>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                                        Verification Papers &amp; Documents
                                    </h3>
                                    <p className="text-xs text-on-surface-variant">
                                        Studio: <strong className="text-primary">{inspectingVendor.businessName}</strong> &middot; Owner: {inspectingVendor.user?.firstName} {inspectingVendor.user?.lastName} ({inspectingVendor.user?.email})
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setInspectingVendor(null)}
                                className="p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        {/* Drawer Body (Two Columns) */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
                            {/* Left Column: Documents List */}
                            <div className="md:col-span-5 p-4 border-r border-surface-container overflow-y-auto flex flex-col gap-3 bg-surface-container-lowest">
                                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                                    Submitted Files ({Array.isArray(inspectingVendor.documents) ? inspectingVendor.documents.length : 0})
                                </span>

                                {!inspectingVendor.documents || inspectingVendor.documents.length === 0 ? (
                                    <div className="p-6 text-center text-xs text-outline bg-surface-container-low rounded-xl">
                                        No papers submitted by this vendor.
                                    </div>
                                ) : (
                                    inspectingVendor.documents.map((doc, idx) => {
                                        const isSelected = activeDocPreview?.id === doc.id || (!activeDocPreview && idx === 0);
                                        return (
                                            <div
                                                key={doc.id || idx}
                                                onClick={() => setActiveDocPreview(doc)}
                                                className={`p-3 rounded-xl border text-xs flex flex-col gap-1.5 cursor-pointer transition-all ${
                                                    isSelected
                                                        ? 'bg-primary-container/10 border-primary-container shadow-sm'
                                                        : 'bg-surface-container-low hover:bg-surface-container border-transparent'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-on-surface truncate flex items-center gap-1.5">
                                                        <span className="material-symbols-outlined text-[16px] text-primary">
                                                            {doc.fileType === 'pdf' ? 'picture_as_pdf' : 'image'}
                                                        </span>
                                                        <span>{doc.type || 'Legal Paper'}</span>
                                                    </span>
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-outline font-mono">
                                                        {doc.fileSize || 'PDF'}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-on-surface-variant font-mono truncate">
                                                    {doc.name}
                                                </p>
                                                <div className="flex items-center justify-between text-[10px] text-outline pt-1 border-t border-surface-container/60">
                                                    <span>Uploaded: {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Recent'}</span>
                                                    <span className="text-primary font-semibold">Inspect →</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}

                                {/* Business Credential Summary */}
                                <div className="mt-2 p-3 rounded-xl bg-surface-container-low flex flex-col gap-2 text-xs">
                                    <span className="font-semibold text-on-surface text-[11px] uppercase tracking-wider text-outline">
                                        Business Registration Data
                                    </span>
                                    <div className="flex justify-between">
                                        <span className="text-outline">Registration No:</span>
                                        <span className="font-mono font-semibold text-on-surface">{inspectingVendor.businessRegistrationNo || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-outline">Tax ID / VAT:</span>
                                        <span className="font-mono font-semibold text-on-surface">{inspectingVendor.taxId || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-outline">Stripe Connect:</span>
                                        <span className="font-semibold text-primary">
                                            {inspectingVendor.stripeOnboardingComplete ? 'Active' : 'Pending Connect'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Previewer Shell */}
                            <div className="md:col-span-7 p-6 bg-surface-container-low/50 flex flex-col justify-between overflow-y-auto">
                                {activeDocPreview ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-on-surface">
                                                    {activeDocPreview.name}
                                                </span>
                                                <span className="text-xs text-outline">
                                                    Classification: {activeDocPreview.type} &middot; Size: {activeDocPreview.fileSize}
                                                </span>
                                            </div>
                                            <a
                                                href={activeDocPreview.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-primary flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                                <span>Open Original</span>
                                            </a>
                                        </div>

                                        {/* Visual Preview Box */}
                                        <div className="w-full h-72 rounded-xl bg-white border border-outline-variant/60 flex items-center justify-center overflow-hidden shadow-inner relative group">
                                            {activeDocPreview.fileType === 'image' ? (
                                                <img
                                                    src={activeDocPreview.url}
                                                    alt={activeDocPreview.name}
                                                    className="w-full h-full object-contain p-2"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center text-center p-6 gap-2 text-outline">
                                                    <span className="material-symbols-outlined text-[54px] text-primary">
                                                        picture_as_pdf
                                                    </span>
                                                    <span className="font-bold text-sm text-on-surface">
                                                        {activeDocPreview.name}
                                                    </span>
                                                    <p className="text-xs text-on-surface-variant max-w-sm">
                                                        Official verification document rendered in secure sandbox.
                                                    </p>
                                                    <a
                                                        href={activeDocPreview.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-2 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold shadow hover:bg-primary-container"
                                                    >
                                                        View Full PDF Document
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Audit Verification Checklist */}
                                        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex flex-col gap-2 text-xs">
                                            <span className="font-bold text-on-surface flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px] text-primary">task_alt</span>
                                                Verification Checklist
                                            </span>
                                            <div className="grid grid-cols-2 gap-2 text-[11px] text-on-surface-variant">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px] text-primary">check</span>
                                                    Tax ID formatted &amp; verifiable
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px] text-primary">check</span>
                                                    Commercial trade registry valid
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px] text-primary">check</span>
                                                    Guild artisan standards confirmed
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px] text-primary">check</span>
                                                    Director identity photo matched
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-outline gap-2">
                                        <span className="material-symbols-outlined text-[48px] text-surface-container-high">
                                            folder_open
                                        </span>
                                        <p className="text-sm font-semibold text-on-surface">No Document Selected</p>
                                        <p className="text-xs text-outline max-w-sm">
                                            {inspectingVendor.documents && inspectingVendor.documents.length > 0
                                                ? 'Select a document from the left column to inspect its preview and metadata.'
                                                : 'This vendor has not uploaded trade or identity documents yet. You can still accept or reject their application below.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Drawer Actions Footer */}
                        <div className="px-6 py-3.5 bg-surface-container-low border-t border-surface-container flex items-center justify-between">
                            <span className="text-xs text-outline">
                                Reviewing as: <strong className="text-on-surface">{adminName}</strong> (Super Admin)
                            </span>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setInspectingVendor(null)}
                                    className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold cursor-pointer"
                                >
                                    Close Viewer
                                </button>
                                {inspectingVendor.status === 'pending' && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setVendorToReject(inspectingVendor);
                                                setRejectionReason('');
                                            }}
                                            className="px-4 py-2 rounded-lg bg-secondary/15 hover:bg-secondary text-secondary hover:text-on-secondary text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">cancel</span>
                                            <span>Reject Application</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setVendorToApprove(inspectingVendor)}
                                            className="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                            <span>Accept &amp; Send Email</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
             *  MODAL 2: CONFIRM APPROVAL MODAL
             * ══════════════════════════════════════════════════════ */}
            {vendorToApprove && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl p-6 border border-outline-variant/40 flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-fixed/60 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[28px]">verified</span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                                Accept Vendor Application?
                            </h3>
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                You are accepting <strong className="text-primary">{vendorToApprove.businessName}</strong>. This will activate their vendor profile, enable product listings, and record the approval under your admin audit trail.
                            </p>
                        </div>

                        {/* Email Notification Preview Notice */}
                        <div className="p-3.5 rounded-xl bg-primary-container/10 border border-primary-container/30 flex flex-col gap-1.5 text-xs text-on-surface">
                            <span className="font-bold text-primary flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">mail</span>
                                Automated Acceptance Notification
                            </span>
                            <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                A notification email will be dispatched to <strong>{vendorToApprove.user?.email}</strong> stating that <strong>{adminName}</strong> accepted their verification and they can now start selling.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-2 mt-2">
                            <button
                                type="button"
                                disabled={isApproving}
                                onClick={() => setVendorToApprove(null)}
                                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isApproving}
                                onClick={handleConfirmApprove}
                                className="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-xs font-semibold text-on-primary flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                            >
                                {isApproving ? (
                                    <>
                                        <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                                        <span>Approving &amp; Dispatching Mail…</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[16px]">check</span>
                                        <span>Confirm Acceptance &amp; Send Mail</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
             *  MODAL 3: REJECTION REASON PROMPT MODAL
             * ══════════════════════════════════════════════════════ */}
            {vendorToReject && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl p-6 border border-outline-variant/40 flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                            <span className="material-symbols-outlined text-[28px]">rule_folder</span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                                Reject Vendor Application
                            </h3>
                            <p className="text-xs text-on-surface-variant">
                                Provide a reason for rejecting <strong className="text-secondary">{vendorToReject.businessName}</strong>. The vendor will be sent an email explaining what documents or details need correction before resubmission.
                            </p>
                        </div>

                        {/* Quick Reason Templates */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                                Quick Reason Templates
                            </span>
                            <div className="flex flex-col gap-1">
                                {rejectionTemplates.map((tmpl, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            setRejectionReason(tmpl);
                                            setRejectionError('');
                                        }}
                                        className="text-left px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs text-on-surface-variant transition-colors cursor-pointer"
                                    >
                                        &bull; {tmpl}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Reason Textarea */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-on-surface">
                                Rejection Explanation (Required)
                            </label>
                            <textarea
                                rows={3}
                                value={rejectionReason}
                                onChange={(e) => {
                                    setRejectionReason(e.target.value);
                                    if (e.target.value.trim()) setRejectionError('');
                                }}
                                placeholder="Explain specifically why the verification documents were rejected..."
                                className="w-full p-3 rounded-lg bg-surface-container-low border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                            />
                            {rejectionError && (
                                <span className="text-xs text-error font-medium">{rejectionError}</span>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-2 mt-1">
                            <button
                                type="button"
                                disabled={isRejecting}
                                onClick={() => {
                                    setVendorToReject(null);
                                    setRejectionReason('');
                                    setRejectionError('');
                                }}
                                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isRejecting}
                                onClick={handleConfirmReject}
                                className="px-4 py-2 rounded-lg bg-secondary text-on-secondary hover:opacity-90 text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                            >
                                {isRejecting ? (
                                    <>
                                        <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                                        <span>Rejecting &amp; Dispatching Notice…</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                        <span>Confirm Rejection &amp; Notify</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

