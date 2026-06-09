const nodemailer = require("nodemailer");

// Graceful no-op if SMTP is not configured
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_NAME = process.env.EMAIL_FROM_NAME || "Akara";
const FROM_ADDR = process.env.EMAIL_FROM_ADDR || SMTP_USER;

let transporter = null;
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

async function sendOrderConfirmation(order) {
  if (!transporter || !order.customerEmail) return;

  const itemRows = (order.items || [])
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0">${i.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center">${i.qty}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right">₹${(i.price * i.qty).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Outfit,sans-serif;max-width:600px;margin:0 auto;color:#111">
      <div style="background:#111;padding:32px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:1.8rem;letter-spacing:-1px">Akara</h1>
      </div>
      <div style="padding:32px;background:#fff;border:1px solid #f0f0f0">
        <h2 style="font-size:1.4rem;margin-bottom:8px">Order Confirmed!</h2>
        <p style="color:#555;margin-bottom:24px">Hi ${order.customerName}, your order has been placed successfully.</p>

        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          <thead>
            <tr style="background:#f8f8f8">
              <th style="padding:10px 12px;text-align:left;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px">Item</th>
              <th style="padding:10px 12px;text-align:center;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px">Price</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <div style="background:#f8f8f8;padding:20px;border-radius:8px;margin-bottom:24px">
          ${order.shipping > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:8px"><span>Shipping</span><span>₹${parseFloat(order.shipping).toFixed(2)}</span></div>` : ""}
          ${order.discountAmount > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:8px;color:#059669"><span>Discount</span><span>-₹${parseFloat(order.discountAmount).toFixed(2)}</span></div>` : ""}
          <div style="display:flex;justify-content:space-between;font-weight:800;font-size:1.1rem;border-top:2px solid #e5e5e5;padding-top:12px;margin-top:8px">
            <span>Total</span><span>₹${parseFloat(order.total).toFixed(2)}</span>
          </div>
        </div>

        <p style="color:#555;font-size:0.9rem">
          Delivering to: <strong>${order.address}, ${order.city} - ${order.pincode}</strong>
        </p>
        <p style="color:#555;font-size:0.9rem">
          Track your order anytime at <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/track-order" style="color:#00d1b2">our tracking page</a> using your phone number.
        </p>
      </div>
      <div style="padding:20px;text-align:center;color:#999;font-size:0.8rem;background:#f8f8f8;border-radius:0 0 12px 12px">
        © ${new Date().getFullYear()} Akara. All rights reserved.
      </div>
    </div>`;

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_ADDR}>`,
    to: order.customerEmail,
    subject: `Order Confirmed — ₹${parseFloat(order.total).toFixed(2)}`,
    html,
  });
}

module.exports = { sendOrderConfirmation };
