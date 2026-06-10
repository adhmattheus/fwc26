-- CreateTable
CREATE TABLE "user_stickers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "album_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_stickers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_stickers_user_id_album_code_key" ON "user_stickers"("user_id", "album_code");

-- AddForeignKey
ALTER TABLE "user_stickers" ADD CONSTRAINT "user_stickers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
