export const initiatePaymentTemplate = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Selesaikan Pembayaran Anda</title>
  <style>
    /* Style untuk fallback jika email client tidak mendukung style di head */
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f9;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f9;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <!-- Kontainer Utama -->
        <table class="container" width="100%" border="0" cellspacing="0" cellpadding="0" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #1c1c1e; border-radius: 8px; color: #ffffff;">
          
          <!-- Header dengan Logo -->
          <tr>
            <td align="center" style="padding: 30px 20px; background-color: #2c2c2e;">
              <h1 style="margin: 0; font-size: 28px; color: #ffffff;">Surya Yudha Cinema</h1>
              <p style="margin: 5px 0 0; color: #a9a9b3;">Tiket Anda Hampir Siap!</p>
            </td>
          </tr>

          <!-- Konten Utama -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 15px; font-size: 22px; color: #ffffff;">Halo, {{namaUser}}!</h2>
              <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.5; color: #e5e5e7;">
                Terima kasih telah melakukan pembelian tiket. Segera selesaikan pembayaran Anda dalam **10 menit** sebelum waktu pembayaran Anda habis.
              </p>

              <!-- Tombol Call to Action (CTA) -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="{{paymentUrl}}" target="_blank" style="display: inline-block; padding: 15px 35px; font-size: 18px; font-weight: bold; color: #ffffff; background-color: #007aff; border-radius: 8px; text-decoration: none;">
                      Bayar Sekarang
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 25px 0 0; text-align: center; font-size: 14px; color: #a9a9b3;">
                Jika tombol tidak berfungsi, salin dan tempel URL berikut di browser Anda:
                <br>
                <a href="{{paymentUrl}}" target="_blank" style="color: #007aff; text-decoration: underline; word-break: break-all;">{{paymentUrl}}</a>
              </p>
            </td>
          </tr>

          <!-- Detail Transaksi -->
          <tr>
            <td style="padding: 0 30px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #444444; padding-top: 20px;">
                <tr>
                  <td style="padding: 10px 0; font-size: 16px; color: #a9a9b3;">ID Pesanan:</td>
                  <td align="right" style="padding: 10px 0; font-size: 16px; color: #ffffff; font-weight: bold;">{{orderId}}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 16px; color: #a9a9b3;">Film:</td>
                  <td align="right" style="padding: 10px 0; font-size: 16px; color: #ffffff;">{{judulFilm}}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 16px; color: #a9a9b3;">Kursi:</td>
                  <td align="right" style="padding: 10px 0; font-size: 16px; color: #ffffff;">{{daftarKursi}}</td>
                </tr>
                <tr style="border-top: 1px solid #444444;">
                  <td style="padding: 15px 0 10px; font-size: 18px; color: #ffffff; font-weight: bold;">Total Pembayaran:</td>
                  <td align="right" style="padding: 15px 0 10px; font-size: 18px; color: #007aff; font-weight: bold;">{{totalBayar}}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px 20px; font-size: 12px; color: #a9a9b3; border-top: 1px solid #444444; margin-top: 20px;">
              <p style="margin: 0;">Email ini dibuat secara otomatis. Mohon tidak membalas email ini.</p>
              <p style="margin: 5px 0 0;">&copy; 2025 Surya Yudha Cinema. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
