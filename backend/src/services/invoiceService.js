import PDFDocument from "pdfkit";
import { uploadPdfBuffer } from "./cloudinaryService.js";
import { formatCurrency } from "../utils/orderHelpers.js";

const buildInvoiceBuffer = (order) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size: "A4", margin: 40 });

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(24).fillColor("#15803d").text("FreshMart Invoice", { align: "left" });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#334155").text("Fresh produce delivered fast.");
    doc.moveDown(1.5);

    doc.fontSize(12).fillColor("#0f172a");
    doc.text(`Invoice For: ${order.deliveryAddress.fullName}`);
    doc.text(`Order ID: ${order.orderId}`);
    doc.text(`Order Date: ${new Date(order.createdAt).toLocaleString("en-IN")}`);
    doc.text(`Payment Method: ${order.paymentMethod}`);
    doc.text(`Payment Status: ${order.paymentStatus}`);
    doc.moveDown();

    doc.fontSize(13).fillColor("#15803d").text("Delivery Address");
    doc.fontSize(11).fillColor("#0f172a");
    doc.text(order.deliveryAddress.line1);
    if (order.deliveryAddress.line2) {
      doc.text(order.deliveryAddress.line2);
    }
    if (order.deliveryAddress.landmark) {
      doc.text(order.deliveryAddress.landmark);
    }
    doc.text(`${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.postalCode}`);
    doc.text(order.deliveryAddress.mobile);
    doc.moveDown(1.5);

    const tableTop = doc.y;
    doc.fontSize(11).fillColor("#0f172a");
    doc.text("Item", 40, tableTop, { width: 220 });
    doc.text("Qty", 270, tableTop, { width: 60 });
    doc.text("Price", 330, tableTop, { width: 90 });
    doc.text("Total", 430, tableTop, { width: 90 });
    doc.moveTo(40, tableTop + 18).lineTo(550, tableTop + 18).strokeColor("#cbd5e1").stroke();

    let currentY = tableTop + 30;
    order.items.forEach((item) => {
      doc.text(`${item.name} (${item.unit})`, 40, currentY, { width: 220 });
      doc.text(String(item.quantity), 270, currentY, { width: 60 });
      doc.text(formatCurrency(item.discountPrice ?? item.price), 330, currentY, { width: 90 });
      doc.text(formatCurrency(item.subtotal), 430, currentY, { width: 90 });
      currentY += 24;
    });

    currentY += 12;
    doc.moveTo(300, currentY).lineTo(550, currentY).strokeColor("#cbd5e1").stroke();
    currentY += 12;
    doc.text(`Subtotal: ${formatCurrency(order.pricing.subtotal)}`, 330, currentY);
    currentY += 18;
    doc.text(`Discount: ${formatCurrency(order.pricing.discount)}`, 330, currentY);
    currentY += 18;
    doc.text(`Delivery Fee: ${formatCurrency(order.pricing.deliveryFee)}`, 330, currentY);
    currentY += 18;
    doc.fontSize(13).fillColor("#15803d").text(`Grand Total: ${formatCurrency(order.pricing.total)}`, 330, currentY);
    currentY += 30;
    doc.fontSize(10).fillColor("#334155").text("Thank you for shopping with FreshMart.", 40, currentY);
    doc.text("Questions? Reach out to support@freshmart.in", 40, currentY + 16);

    doc.end();
  });

export const generateInvoice = async (order) => {
  const buffer = await buildInvoiceBuffer(order);
  return uploadPdfBuffer(buffer, `${order.orderId}.pdf`);
};

