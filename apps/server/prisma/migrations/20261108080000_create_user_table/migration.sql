-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR(64) NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "nickname" VARCHAR(64) NOT NULL,
    "avatar_url" VARCHAR(512),
    "password_hash" VARCHAR(255) NOT NULL,
    "global_role" VARCHAR(32) NOT NULL DEFAULT 'general_user',
    "must_change_password" BOOLEAN NOT NULL DEFAULT true,
    "status" VARCHAR(16) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- 限定全局角色和账号状态，避免写入设计规范之外的值。
ALTER TABLE "users"
ADD CONSTRAINT "users_global_role_check"
CHECK ("global_role" IN ('system_admin', 'kb_admin', 'general_user'));

ALTER TABLE "users"
ADD CONSTRAINT "users_status_check"
CHECK ("status" IN ('active', 'disabled'));

-- 由数据库统一维护更新时间，保证非 Prisma 更新也能刷新该字段。
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON "users"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_updated_at();
