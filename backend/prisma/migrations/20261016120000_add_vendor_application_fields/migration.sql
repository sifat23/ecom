-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM (
    'sole_proprietor',
    'partnership',
    'llc',
    'corporation',
    'cooperative',
    'other'
);

-- CreateEnum
CREATE TYPE "VendorDocumentType" AS ENUM (
    'business_registration',
    'tax_certificate',
    'national_id',
    'tax_clearance',
    'bank_statement',
    'store_logo',
    'product_photo',
    'other'
);

-- AlterTable: business identity
ALTER TABLE "vendors"
    ADD COLUMN "legal_business_name"  VARCHAR(255),
    ADD COLUMN "business_type"        "BusinessType",
    ADD COLUMN "business_phone"       VARCHAR(20),
    ADD COLUMN "business_email"       VARCHAR(255),
    ADD COLUMN "website"              VARCHAR(255),
    ADD COLUMN "years_in_business"    INTEGER,
    ADD COLUMN "employee_count"       INTEGER,
    ADD COLUMN "vat_number"           VARCHAR(50);

-- AlterTable: business address (structured)
ALTER TABLE "vendors"
    ADD COLUMN "business_address_line1" VARCHAR(255),
    ADD COLUMN "business_address_line2" VARCHAR(255),
    ADD COLUMN "business_city"          VARCHAR(100),
    ADD COLUMN "business_state"         VARCHAR(100),
    ADD COLUMN "business_zip"           VARCHAR(20),
    ADD COLUMN "business_country"       VARCHAR(2);

-- AlterTable: bank / payout details
ALTER TABLE "vendors"
    ADD COLUMN "bank_account_holder" VARCHAR(255),
    ADD COLUMN "bank_account_number" VARCHAR(255),
    ADD COLUMN "bank_name"           VARCHAR(255),
    ADD COLUMN "bank_routing_number" VARCHAR(100),
    ADD COLUMN "bank_iban"           VARCHAR(50),
    ADD COLUMN "bank_swift"          VARCHAR(20);

-- AlterTable: application lifecycle
ALTER TABLE "vendors"
    ADD COLUMN "application_submitted_at" TIMESTAMPTZ,
    ADD COLUMN "application_reviewed_at"  TIMESTAMPTZ;

-- Indexes for admin filtering
CREATE INDEX "vendors_business_country_idx" ON "vendors"("business_country");
CREATE INDEX "vendors_application_submitted_at_idx" ON "vendors"("application_submitted_at");