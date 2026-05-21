-- CreateEnum
CREATE TYPE "PurchaseReceiptStatus" AS ENUM ('DRAFT', 'POSTED', 'VOIDED');

-- CreateTable
CREATE TABLE "PurchaseReceipt" (
    "id" SERIAL NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "status" "PurchaseReceiptStatus" NOT NULL DEFAULT 'DRAFT',
    "reference" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseReceiptLine" (
    "id" SERIAL NOT NULL,
    "purchaseReceiptId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "unitCost" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseReceiptLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseReceipt_receiptNumber_key" ON "PurchaseReceipt"("receiptNumber");

-- CreateIndex
CREATE INDEX "PurchaseReceipt_supplierId_idx" ON "PurchaseReceipt"("supplierId");

-- CreateIndex
CREATE INDEX "PurchaseReceipt_status_idx" ON "PurchaseReceipt"("status");

-- CreateIndex
CREATE INDEX "PurchaseReceipt_receivedAt_idx" ON "PurchaseReceipt"("receivedAt");

-- CreateIndex
CREATE INDEX "PurchaseReceiptLine_purchaseReceiptId_idx" ON "PurchaseReceiptLine"("purchaseReceiptId");

-- CreateIndex
CREATE INDEX "PurchaseReceiptLine_productId_idx" ON "PurchaseReceiptLine"("productId");

-- CreateIndex
CREATE INDEX "PurchaseReceiptLine_warehouseId_idx" ON "PurchaseReceiptLine"("warehouseId");

-- AddForeignKey
ALTER TABLE "PurchaseReceipt" ADD CONSTRAINT "PurchaseReceipt_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseReceiptLine" ADD CONSTRAINT "PurchaseReceiptLine_purchaseReceiptId_fkey" FOREIGN KEY ("purchaseReceiptId") REFERENCES "PurchaseReceipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseReceiptLine" ADD CONSTRAINT "PurchaseReceiptLine_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseReceiptLine" ADD CONSTRAINT "PurchaseReceiptLine_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
