import { env } from '../config/env.js';

const shell = (title, bodyHtml) => `
<!doctype html>
<html><body style="margin:0;padding:0;background:#f7faf8;font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:#181c1b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7faf8;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;">
        <tr><td>
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#003629;">${title}</h1>
          ${bodyHtml}
          <hr style="margin:32px 0;border:none;border-top:1px solid #e6e9e7;" />
          <p style="margin:0;font-size:12px;color:#707974;">Marketplace &middot; This is an automated message.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>
`;

export function passwordResetEmail({ firstName, resetUrl, ttlMinutes }) {
    return {
        subject: 'Reset your Marketplace password',
        html: shell(
            'Reset your password',
            `
        <p style="margin:0 0 16px;font-size:15px;line-height:24px;">
          Hi ${firstName || 'there'}, we received a request to reset your Marketplace password.
        </p>
        <p style="margin:0 0 24px;font-size:15px;line-height:24px;">
          Click the button below to choose a new password. This link expires in ${ttlMinutes} minutes.
        </p>
        <p style="margin:0 0 32px;">
          <a href="${resetUrl}" style="display:inline-block;background:#003629;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">
            Reset password
          </a>
        </p>
        <p style="margin:0;font-size:13px;color:#707974;">
          If the button doesn't work, paste this URL into your browser:<br/>
          <span style="word-break:break-all;color:#404945;">${resetUrl}</span>
        </p>
        <p style="margin:24px 0 0;font-size:13px;color:#707974;">
          Didn't request this? You can safely ignore this email — your password won't change.
        </p>
      `
        ),
        text: `Hi ${firstName || 'there'},\n\nReset your Marketplace password (expires in ${ttlMinutes} min):\n${resetUrl}\n\nIf you didn't request this, ignore this email.`,
    };
}

export function welcomeEmail({ firstName, role }) {
    const isVendor = role === 'vendor';
    return {
        subject: 'Welcome to Marketplace',
        html: shell(
            `Welcome${firstName ? `, ${firstName}` : ''}!`,
            `
        <p style="margin:0 0 16px;font-size:15px;line-height:24px;">
          Your Marketplace account is ready.
        </p>
        ${
                isVendor
                    ? `<p style="margin:0 0 24px;font-size:15px;line-height:24px;">
                 Next step: finish your vendor onboarding to start listing products.
               </p>
               <p style="margin:0 0 32px;">
                 <a href="${env.APP_URL}/sell/onboarding"
                    style="display:inline-block;background:#003629;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">
                   Continue onboarding
                 </a>
               </p>`
                    : `<p style="margin:0;font-size:15px;line-height:24px;">
                 Browse the store and find something you love.
               </p>
               <p style="margin:24px 0 0;">
                 <a href="${env.APP_URL}"
                    style="display:inline-block;background:#003629;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">
                   Start shopping
                 </a>
               </p>`
            }
      `
        ),
        text: `Welcome to Marketplace${firstName ? `, ${firstName}` : ''}! Your account is ready.`,
    };
}

export function emailVerificationEmail({ firstName, verifyUrl, ttlMinutes }) {
    return {
        subject: 'Verify your Marketplace email',
        html: shell(
            'Confirm your email',
            `
        <p style="margin:0 0 16px;font-size:15px;line-height:24px;">
          Hi ${firstName || 'there'} — welcome to Marketplace!
        </p>
        <p style="margin:0 0 24px;font-size:15px;line-height:24px;">
          Click the button below to verify your email address.
          <strong>This link expires in ${ttlMinutes} minutes.</strong>
        </p>
        <p style="margin:0 0 32px;">
          <a href="${verifyUrl}" style="display:inline-block;background:#003629;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">
            Verify email
          </a>
        </p>
        <p style="margin:0;font-size:13px;color:#707974;">
          If the button doesn't work, paste this URL into your browser:<br/>
          <span style="word-break:break-all;color:#404945;">${verifyUrl}</span>
        </p>
        <p style="margin:24px 0 0;font-size:13px;color:#707974;">
          If the link expires, don't worry — you can request a fresh one from the verification page.
        </p>
      `
        ),
        text: `Hi ${firstName || 'there'},\n\nVerify your Marketplace email (expires in ${ttlMinutes} min):\n${verifyUrl}\n\nIf the link expires you can request a new one from the verification page.`,
    };
}

export function vendorApprovedEmail({ vendorName, adminName, adminEmail, dashboardUrl }) {
    const approver = adminName ? `${adminName} (${adminEmail})` : (adminEmail || 'Super Admin');
    return {
        subject: `Your Vendor Application for ${vendorName} Has Been Accepted!`,
        html: shell(
            'Application Accepted — Welcome to Minimog Marketplace',
            `
        <p style="margin:0 0 16px;font-size:15px;line-height:24px;">
          Congratulations! Your vendor application and verification documents for <strong>${vendorName}</strong> have been formally reviewed and <strong>accepted</strong> by administrator <strong>${approver}</strong>.
        </p>
        <p style="margin:0 0 24px;font-size:15px;line-height:24px;color:#181c1b;">
          Your vendor account is now fully active. You can now access your Vendor Console, manage your catalog, list handcrafted products, and start selling!
        </p>
        <p style="margin:0 0 32px;">
          <a href="${dashboardUrl || `${env.APP_URL}/vendor/dashboard`}" style="display:inline-block;background:#003629;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">
            Go to Vendor Dashboard & Start Selling
          </a>
        </p>
        <p style="margin:0;font-size:13px;color:#707974;">
          Reviewed on: ${new Date().toLocaleString()}<br/>
          Approved by: ${approver}
        </p>
        <p style="margin:24px 0 0;font-size:13px;color:#707974;">
          Need assistance setting up inventory or Stripe payouts? Reply to this email or visit our Atelier vendor support desk.
        </p>
      `
        ),
        text: `Congratulations! Your vendor application for ${vendorName} has been accepted by ${approver}. You can now access your dashboard and start selling:\n${dashboardUrl || `${env.APP_URL}/vendor/dashboard`}`,
    };
}

export function vendorRejectedEmail({ vendorName, adminName, adminEmail, reason, resubmitUrl }) {
    const reviewer = adminName ? `${adminName} (${adminEmail})` : (adminEmail || 'Super Admin');
    return {
        subject: `Update regarding your Vendor Application for ${vendorName}`,
        html: shell(
            'Vendor Application Status Update',
            `
        <p style="margin:0 0 16px;font-size:15px;line-height:24px;">
          Dear ${vendorName} Artisan Team,
        </p>
        <p style="margin:0 0 16px;font-size:15px;line-height:24px;">
          Thank you for submitting your boutique application and verification papers. After careful review by administrator <strong>${reviewer}</strong>, your application was not approved at this time.
        </p>
        <div style="margin:0 0 24px;padding:16px;background:#fef2f2;border-left:4px solid #ba1a1a;border-radius:4px;">
          <strong style="color:#ba1a1a;font-size:14px;">Reason for Rejection:</strong>
          <p style="margin:8px 0 0;font-size:14px;color:#410100;line-height:22px;">
            ${reason || 'Additional verification documentation is required.'}
          </p>
        </div>
        <p style="margin:0 0 24px;font-size:15px;line-height:24px;">
          You may update your business profile, upload required missing documents, and resubmit your application for review at any time.
        </p>
        <p style="margin:0 0 32px;">
          <a href="${resubmitUrl || `${env.APP_URL}/vendor/rejected`}" style="display:inline-block;background:#003629;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">
            Review Application & Resubmit
          </a>
        </p>
      `
        ),
        text: `Your vendor application for ${vendorName} was not approved at this time.\nReason: ${reason}\nYou can resubmit your application here:\n${resubmitUrl || `${env.APP_URL}/vendor/rejected`}`,
    };
}