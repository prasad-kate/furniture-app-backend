-- CreateTable
CREATE TABLE "ProductsCategory" (
    "category_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "ProductsCategory_pkey" PRIMARY KEY ("category_id")
);
