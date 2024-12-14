/*
  Warnings:

  - Added the required column `category_id` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "category_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "ProductsCategory"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;
