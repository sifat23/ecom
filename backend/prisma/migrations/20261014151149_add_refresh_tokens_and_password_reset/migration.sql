-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "password_reset_expires_at" TIMESTAMPTZ,
ADD COLUMN     "password_reset_token_hash" VARCHAR(255);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password_reset_expires_at" TIMESTAMPTZ,
ADD COLUMN     "password_reset_token_hash" VARCHAR(255);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "actor_type" "ActorType" NOT NULL,
    "actor_id" UUID NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "revoked_at" TIMESTAMPTZ,
    "replaced_by" UUID,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_actor_type_actor_id_idx" ON "refresh_tokens"("actor_type", "actor_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");
