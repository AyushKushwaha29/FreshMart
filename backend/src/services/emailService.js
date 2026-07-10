import nodemailer from "nodemailer";
import dns from "dns";
import dns from "node:dns/promises";

(async () => {
  try {
    const result = await dns.lookup("smtp.gmail.com", {
      family: 4,
      all: true
    });

    console.log("SMTP DNS:", result);
  } catch (err) {
    console.error("DNS ERROR:", err);
  }
})();

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,

  tls: {
    rejectUnauthorized: false
  }
});

(async () => {
  try {
    await transporter.verify();
    console.log("✅ Email Service Ready");
  } catch (err) {
    console.error("❌ Email Error:", err);
  }
})();
// ✅ Verify transporter
if (process.env.NODE_ENV !== "production") {
  transporter.verify((error) => {
    if (error) {
      console.error(error);
    } else {
      console.log("✅ Email Service Ready");
    }
  });
}

export const sendOrderConfirmationEmail = async ({
  email,
  name,
  order
}) => {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #eee;">
          ${item.name}
        </td>

        <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">
          ${item.quantity}
        </td>

        <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">
          ₹${item.subtotal}
        </td>
      </tr>
    `
    )
    .join("");

  const html = `
  <div style="
      max-width:700px;
      margin:auto;
      background:#ffffff;
      border-radius:12px;
      overflow:hidden;
      font-family:Arial,sans-serif;
      border:1px solid #ddd;
  ">

      <div style="
          background:#16a34a;
          color:white;
          padding:30px;
          text-align:center;
      ">

          <h1 style="margin:0;">
              🛒 FreshMart
          </h1>

          <p style="margin-top:10px;">
              Fresh Groceries Delivered Fast
          </p>

      </div>

      <div style="padding:30px;">

          <h2>
              Hi ${name},
          </h2>

          <p>
              Thank you for shopping with
              <b>FreshMart ❤️</b>
          </p>

          <h3>
              Order Details
          </h3>

          <p>

              <b>Order ID :</b>
              ${order.orderId}

              <br>

              <b>Payment :</b>
              ${order.paymentMethod}

              <br>

              <b>Status :</b>
              ${order.status}

          </p>

          <table
          style="
              width:100%;
              border-collapse:collapse;
              margin-top:20px;
          ">

              <thead>

                  <tr style="background:#f3f4f6;">

                      <th style="padding:12px;">
                          Item
                      </th>

                      <th style="padding:12px;">
                          Qty
                      </th>

                      <th style="padding:12px;">
                          Total
                      </th>

                  </tr>

              </thead>

              <tbody>

                  ${itemsHtml}

              </tbody>

          </table>

          <h2
          style="
              margin-top:30px;
              color:#16a34a;
          ">

              Grand Total :
              ₹${order.pricing.total}

          </h2>

          ${
            order.invoiceUrl
              ? `
          <div style="margin-top:30px;">

            <a
            href="${order.invoiceUrl}"

            style="
                background:#16a34a;
                color:white;
                padding:14px 22px;
                text-decoration:none;
                border-radius:8px;
                display:inline-block;
            ">

            Download Invoice

            </a>

          </div>
          `
              : ""
          }

      </div>
      <div
      style="
          background:#f8fafc;
          padding:20px;
          text-align:center;
          color:#64748b;
      ">
          Thank you for choosing FreshMart 🌿
      </div>
  </div>
  `;

  await transporter.sendMail({
    from: `"FreshMart" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Order Confirmed | ${order.orderId}`,
    html
  });

  console.log("📧 Email Sent Successfully");
};
export const sendOrderDeliveredEmail = async ({
  email,
  name,
  order
}) => {

  const html = `
  <div style="font-family:Arial;padding:30px;max-width:700px;margin:auto">

      <h1 style="color:#16a34a">
          🎉 FreshMart
      </h1>

      <h2>
          Hi ${name},
      </h2>

      <p style="font-size:18px">

          Your order
          <b>${order.orderId}</b>

          has been
          <span style="color:green;font-weight:bold">
              Delivered Successfully
          </span>

      </p>

      <p>

          We hope you enjoy your groceries ❤️

      </p>

      <p>

          Thank you for shopping with FreshMart.

      </p>

      ${
        order.invoiceUrl
          ? `
      <a
      href="${order.invoiceUrl}"
      style="
      background:#16a34a;
      color:white;
      padding:12px 20px;
      text-decoration:none;
      border-radius:8px;
      display:inline-block;
      ">

      Download Invoice

      </a>
      `
          : ""
      }

  </div>
  `;

  await transporter.sendMail({
    from: `"FreshMart" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🎉 Order Delivered | ${order.orderId}`,
    html
  });

  console.log("✅ Delivered Email Sent");
};
export const sendOrderCancelledEmail = async ({
  email,
  name,
  order
}) => {

  const html = `
  <div style="font-family:Arial;padding:30px;max-width:700px;margin:auto">

      <h1 style="color:#dc2626">
          FreshMart
      </h1>

      <h2>
          Hi ${name},
      </h2>

      <p style="font-size:18px">

          Your order

          <b>${order.orderId}</b>

          has been

          <span style="color:#dc2626;font-weight:bold">

          Cancelled

          </span>

      </p>

      <p>

          If you have already paid,
          your refund (if applicable)
          will be processed soon.

      </p>

      <p>

          We are sorry for the inconvenience.

      </p>

  </div>
  `;

  await transporter.sendMail({
    from: `"FreshMart" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `❌ Order Cancelled | ${order.orderId}`,
    html
  });

  console.log("❌ Cancelled Email Sent");
};

export const sendOtpEmail = async ({
  email,
  name,
  otp
}) => {

  const html = `
  <div style="max-width:600px;margin:auto;padding:30px;font-family:Arial">

      <h1 style="color:#16a34a">
          FreshMart
      </h1>

      <h2>Hello ${name || "Customer"} 👋</h2>

      <p>
          Your verification OTP is
      </p>

      <div
      style="
      font-size:42px;
      letter-spacing:12px;
      font-weight:bold;
      color:#16a34a;
      margin:30px 0;
      ">
      ${otp}
      </div>

      <p>
          This OTP is valid for
          <b>5 minutes</b>.
      </p>

      <p>
          Never share your OTP with anyone.
      </p>

  </div>
  `;

  await transporter.sendMail({
      from:`"FreshMart"<${process.env.EMAIL_USER}>`,
      to:email,
      subject:"FreshMart Login OTP",
      html
  });

};