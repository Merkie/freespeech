-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "identifier_token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL DEFAULT 'Anonymous',
    "image" TEXT NOT NULL DEFAULT '',
    "hashed_password" TEXT,
    "theme" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" SERIAL NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tile" (
    "id" SERIAL NOT NULL,
    "tap_count" INTEGER NOT NULL DEFAULT 0,
    "display" TEXT NOT NULL,
    "speak" TEXT,
    "image" TEXT,
    "navigation" TEXT,
    "modifier" TEXT,
    "backgroundColor" TEXT,
    "borderColor" TEXT,
    "accented" BOOLEAN NOT NULL DEFAULT false,
    "silent" BOOLEAN NOT NULL DEFAULT false,
    "invisible" BOOLEAN NOT NULL DEFAULT false,
    "index" SERIAL NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tilePageId" INTEGER,

    CONSTRAINT "tile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tile_page" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "columns" INTEGER NOT NULL DEFAULT 8,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "tile_page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "index" INTEGER NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "S3Resource" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "S3Resource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_identifier_token_key" ON "user"("identifier_token");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_id_key" ON "refresh_token"("id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_refresh_token_key" ON "refresh_token"("refresh_token");

-- CreateIndex
CREATE INDEX "refresh_token_user_id_idx" ON "refresh_token"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tile_id_key" ON "tile"("id");

-- CreateIndex
CREATE INDEX "tile_user_id_idx" ON "tile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tile_page_id_key" ON "tile_page"("id");

-- CreateIndex
CREATE INDEX "tile_page_user_id_idx" ON "tile_page"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_id_key" ON "project"("id");

-- CreateIndex
CREATE UNIQUE INDEX "S3Resource_id_key" ON "S3Resource"("id");

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tile" ADD CONSTRAINT "tile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tile" ADD CONSTRAINT "tile_tilePageId_fkey" FOREIGN KEY ("tilePageId") REFERENCES "tile_page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tile_page" ADD CONSTRAINT "tile_page_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tile_page" ADD CONSTRAINT "tile_page_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
