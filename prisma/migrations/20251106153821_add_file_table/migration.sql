-- CreateTable
CREATE TABLE "sys_file" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bucket_name" VARCHAR(100) NOT NULL,
    "bucket_type" VARCHAR(50) NOT NULL,
    "folder" VARCHAR(100) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "original_name" VARCHAR(255) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "file_url" TEXT NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sys_file_pkey" PRIMARY KEY ("id")
);
