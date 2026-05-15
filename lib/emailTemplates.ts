/**
 * Premium HTML Email Templates for Tears Hot Sauce
 */

const baseStyles = `
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }
  .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
  .header { background: linear-gradient(135deg, #ff3b30 0%, #8b0000 100%); padding: 40px 20px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase; }
  .content { padding: 40px 30px; }
  .footer { background: #1a1a1a; padding: 30px; text-align: center; color: #888; font-size: 12px; }
  .button { display: inline-block; padding: 14px 30px; background: #ff3b30; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
  .order-box { background: #f8f8f8; border: 1px solid #eee; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .item { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
  .total { border-top: 2px solid #eee; margin-top: 15px; padding-top: 15px; font-weight: bold; font-size: 18px; color: #ff3b30; }
  .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 5px; color: #ff3b30; margin: 20px 0; text-align: center; }
`;

export const getOrderConfirmationTemplate = (name: string, orderId: string, products: any[], totalAmount: number, customerDetails: any) => `
  <!DOCTYPE html>
  <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="container">
        <div class="header"><img src="cid:logo" alt="TEARS" style="height: 50px; width: auto;" /></div>
        <div class="content">
          <h2>Order Confirmed! 🔥</h2>
          <p>Hi ${name},</p>
          <p>Get ready to feel the heat! Your order <strong>#${orderId}</strong> has been successfully placed and is being prepared for shipment.</p>
          
          <div class="order-box">
            <h3>Order Summary</h3>
            ${products.map(p => `
              <div class="item">
                <span>${p.name} (x${p.quantity || 1})</span>
                <span>₹${(p.price || 0).toLocaleString('en-IN')}</span>
              </div>
            `).join('')}
            <div class="total">
              <span>Total Paid</span>
              <span>₹${totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div class="order-box">
            <h3>Customer & Shipping Details</h3>
            <div style="font-size: 14px; color: #555; line-height: 1.8;">
              <div><strong>Email:</strong> ${customerDetails.email || 'N/A'}</div>
              <div><strong>Phone:</strong> ${customerDetails.phone || 'N/A'}</div>
              <div><strong>Address:</strong><br/>${customerDetails.address || 'N/A'}</div>
            </div>
          </div>

          <p>We'll notify you as soon as your bottles of fire are on their way.</p>
          <a href="https://tears.co.in/my-orders" class="button">Track My Order</a>
        </div>
        <div class="footer">
          <p>&copy; 2025 TEARS Hot Sauce. All rights reserved.</p>
          <p>Spreading the heat, one drop at a time.</p>
        </div>
      </div>
    </body>
  </html>
`;

export const getPaymentFailedTemplate = (name: string, orderId: string) => `
  <!DOCTYPE html>
  <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="container">
        <div class="header" style="background: #333;"><img src="cid:logo" alt="TEARS" style="height: 50px; width: auto;" /></div>
        <div class="content">
          <h2 style="color: #ff3b30;">Payment Failed ⚠️</h2>
          <p>Hi ${name},</p>
          <p>We tried to process your payment for order <strong>#${orderId}</strong>, but unfortunately, it didn't go through.</p>
          <p>Don't let the fire go out! Your items are still reserved for a short time. You can try the payment again using the link below.</p>
          <a href="https://tears.co.in/checkout" class="button">Retry Payment</a>
          <p style="margin-top: 30px; font-size: 13px; color: #666;">If you have any questions, please contact our support team at tearshxd@gmail.com</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 TEARS Hot Sauce. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;

export const getPendingOrderTemplate = (name: string, orderId: string) => `
  <!DOCTYPE html>
  <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="container">
        <div class="header" style="background: #555;"><img src="cid:logo" alt="TEARS" style="height: 50px; width: auto;" /></div>
        <div class="content">
          <h2>Order Pending ⏳</h2>
          <p>Hi ${name},</p>
          <p>Your order <strong>#${orderId}</strong> is currently pending. This usually happens while we wait for payment confirmation from your bank or gateway.</p>
          <p>We are monitoring the status and will update you as soon as it's confirmed. No further action is needed from your side right now.</p>
          <a href="https://tears.co.in/my-orders" class="button">Check Status</a>
        </div>
        <div class="footer">
          <p>&copy; 2025 TEARS Hot Sauce. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;

export const getResetPasswordTemplate = (name: string, code: string) => `
  <!DOCTYPE html>
  <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="container">
        <div class="header"><img src="cid:logo" alt="TEARS" style="height: 50px; width: auto;" /></div>
        <div class="content" style="text-align: center;">
          <h2>Reset Your Password</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Use the code below to proceed. This code will expire in 15 minutes.</p>
          <div class="otp-code">${code}</div>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 TEARS Hot Sauce. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;

export const getPromotionalTemplate = (name: string, subject: string, message: string, imageUrl: string | null = null) => {
  const formattedMessage = message
    .split(/\r?\n/)
    .map(line => {
      const trimmed = line.trim();
      if (trimmed.match(/^(https?:\/\/)?.*\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i)) {
        const url = (trimmed.startsWith('http') || trimmed.startsWith('//')) ? trimmed : `https://${trimmed}`;
        return `<div style="margin: 20px 0;"><img src="${url}" style="width: 100%; max-width: 500px; border-radius: 8px;" /></div>`;
      }
      return trimmed === '' ? '&nbsp;' : line;
    })
    .join('<br/>');

  return `
  <!DOCTYPE html>
  <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="container">
        <div class="header"><img src="cid:logo" alt="TEARS" style="height: 50px; width: auto;" /></div>
        <div class="content" style="text-align: center;">
          <h2 style="color: #ff3b30; font-size: 24px; margin-bottom: 20px;">${subject}</h2>
          
          ${imageUrl ? `<div style="margin-bottom: 25px;"><img src="${imageUrl}" alt="Promo" style="width: 100%; max-width: 540px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);" /></div>` : ''}

          <p style="font-size: 16px; color: #666;">Hi ${name},</p>
          
          <div style="font-size: 16px; line-height: 1.8; color: #444; margin: 20px 0;">
            ${formattedMessage}
          </div>

          <a href="https://tears.co.in/#products" class="button">Explore the Collection</a>
        </div>
        <div class="footer">
          <p>You received this because you're a registered user of Tears Hot Sauce.</p>
          <p>&copy; 2025 TEARS Hot Sauce. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;
};

export const getPartnerInquiryTemplate = (businessName: string, contactName: string, contactNumber: string, email: string, message: string, bestTime: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        ${baseStyles}
        .b2b-header { background: #000; padding: 50px 20px; text-align: center; border-bottom: 4px solid #ff3b30; }
        .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
        .stat-item { background: #fdfdfd; border: 1px solid #eee; padding: 15px; border-radius: 10px; }
        .stat-label { font-size: 11px; text-transform: uppercase; color: #888; font-weight: 700; margin-bottom: 5px; }
        .stat-value { font-size: 16px; color: #000; font-weight: 600; }
        .highlight { color: #ff3b30; font-weight: 800; }
      </style>
    </head>
    <body>
      <div class="container" style="border: 1px solid #eee;">
        <div class="b2b-header">
          <img src="cid:logo" alt="TEARS" style="height: 60px; width: auto; margin-bottom: 15px;" />
          <div style="color: #ff3b30; font-weight: 900; letter-spacing: 3px; font-size: 14px;">PARTNERSHIP PROGRAM</div>
        </div>
        <div class="content">
          <h2 style="font-size: 28px; font-weight: 900; letter-spacing: -1px; margin-bottom: 10px;">Hello ${contactName},</h2>
          <p style="font-size: 16px; color: #555;">Thank you for reaching out to <span class="highlight">TEARS</span>. We're thrilled at the prospect of collaborating with <span style="color: #000; font-weight: 700;">${businessName}</span>.</p>
          
          <div style="background: #000; color: #fff; padding: 25px; border-radius: 16px; margin: 30px 0;">
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">Our partnership team has received your inquiry and is currently reviewing how we can best work together to bring the heat to your customers.</p>
            <p style="margin: 15px 0 0; font-size: 16px; font-weight: 700; color: #ff3b30;">We will be contacting you very soon.</p>
          </div>

          <h3 style="text-transform: uppercase; font-size: 13px; letter-spacing: 1px; color: #888; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Inquiry Details</h3>
          
          <div class="stat-grid">
            <div class="stat-item">
              <div class="stat-label">Business Name</div>
              <div class="stat-value">${businessName}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Contact Number</div>
              <div class="stat-value">${contactNumber}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Email Address</div>
              <div class="stat-value">${email}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Best Time to Talk</div>
              <div class="stat-value">${bestTime || 'Anytime'}</div>
            </div>
          </div>

          <div class="stat-item" style="margin-bottom: 30px;">
            <div class="stat-label">Collaboration / Query</div>
            <div style="font-size: 14px; color: #333; line-height: 1.6;">${message}</div>
          </div>

          <p style="font-size: 14px; color: #888; text-align: center; margin-top: 40px;">
            This is an automated confirmation of your partnership inquiry. <br/>
            Our B2B representative will reach out to you within 24-48 hours.
          </p>
        </div>
        <div class="footer">
          <p>&copy; 2025 TEARS Hot Sauce | B2B Division</p>
          <p>Innovating Taste. Scaling Heat.</p>
        </div>
      </div>
    </body>
  </html>
`;
