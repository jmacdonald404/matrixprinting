-- CreateTable
CREATE TABLE "Garment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "Garment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GarmentColor" (
    "id" SERIAL NOT NULL,
    "garmentId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "hexCode" TEXT NOT NULL,

    CONSTRAINT "GarmentColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "totalQuote" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "designId" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "garmentId" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceEach" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Design" (
    "id" TEXT NOT NULL,
    "canvasJson" JSONB NOT NULL,
    "previewUrl" TEXT NOT NULL,

    CONSTRAINT "Design_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_designId_key" ON "Order"("designId");

-- AddForeignKey
ALTER TABLE "GarmentColor" ADD CONSTRAINT "GarmentColor_garmentId_fkey" FOREIGN KEY ("garmentId") REFERENCES "Garment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_garmentId_fkey" FOREIGN KEY ("garmentId") REFERENCES "Garment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
