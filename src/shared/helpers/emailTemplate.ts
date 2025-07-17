export const initiatePaymentTemplate = `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f9">
    <table
      width="100%"
      border="0"
      cellspacing="0"
      cellpadding="0"
      style="background-color: #f4f4f9"
    >
      <tr>
        <td align="center" style="padding: 20px 0">
          <!-- Kontainer Utama -->
          <table
            class="container"
            width="100%"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #1c1c1e;
              border-radius: 8px;
              color: #ffffff;
            "
          >
            <!-- Header dengan Logo -->
            <tr>
              <td align="center" style="padding: 30px 20px; background-color: #2c2c2e">
                <h1 style="margin: 0; font-size: 28px; color: #ffffff">Surya Yudha Cinema</h1>
                <p style="margin: 5px 0 0; color: #a9a9b3">Tiket Anda Hampir Siap!</p>
              </td>
            </tr>

            <!-- Konten Utama -->
            <tr>
              <td style="padding: 40px 30px">
                <h2 style="margin: 0 0 15px; font-size: 22px; color: #ffffff">
                  Halo, {{namaUser}}!
                </h2>
                <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.5; color: #e5e5e7">
                  Terima kasih telah melakukan pembelian tiket. Segera selesaikan pembayaran Anda
                  dalam 10 menit sebelum waktu pembayaran Anda habis.
                </p>

                <!-- Tombol Call to Action (CTA) -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center">
                      <a
                        href="{{paymentUrl}}"
                        target="_blank"
                        style="
                          display: inline-block;
                          padding: 15px 35px;
                          font-size: 18px;
                          font-weight: bold;
                          color: #ffffff;
                          background-color: #007aff;
                          border-radius: 8px;
                          text-decoration: none;
                        "
                      >
                        Bayar Sekarang
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin: 25px 0 0; text-align: center; font-size: 14px; color: #a9a9b3">
                  Jika tombol tidak berfungsi, salin dan tempel URL berikut di browser Anda:
                  <br />
                  <a
                    href="{{paymentUrl}}"
                    target="_blank"
                    style="color: #007aff; text-decoration: underline; word-break: break-all"
                    >{{paymentUrl}}</a
                  >
                </p>
              </td>
            </tr>

            <!-- Detail Transaksi -->
            <tr>
              <td style="padding: 0 30px">
                <table
                  width="100%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  style="border-top: 1px solid #444444; padding-top: 20px"
                >
                  <tr>
                    <td style="padding: 10px 0; font-size: 16px; color: #a9a9b3">ID Pesanan:</td>
                    <td
                      align="right"
                      style="padding: 10px 0; font-size: 16px; color: #ffffff; font-weight: bold"
                    >
                      {{orderId}}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-size: 16px; color: #a9a9b3">Film:</td>
                    <td align="right" style="padding: 10px 0; font-size: 16px; color: #ffffff">
                      {{judulFilm}}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-size: 16px; color: #a9a9b3">Jumlah Tiket:</td>
                    <td align="right" style="padding: 10px 0; font-size: 16px; color: #ffffff">
                      {{jumlahTiket}}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-size: 16px; color: #a9a9b3">Kursi:</td>
                    <td align="right" style="padding: 10px 0; font-size: 16px; color: #ffffff">
                      {{daftarKursi}}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-size: 16px; color: #a9a9b3">
                      Subtotal untuk tiket:
                    </td>
                    <td align="right" style="padding: 10px 0; font-size: 16px; color: #ffffff">
                      {{subTotal}}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-size: 16px; color: #a9a9b3">
                      Voucher yang digunakan:
                    </td>
                    <td align="right" style="padding: 10px 0; font-size: 16px; color: #ffffff">
                      {{discountAmount}}
                    </td>
                  </tr>
                  <tr style="border-top: 1px solid #444444">
                    <td
                      style="
                        padding: 15px 0 10px;
                        font-size: 18px;
                        color: #ffffff;
                        font-weight: bold;
                      "
                    >
                      Total Pembayaran:
                    </td>
                    <td
                      align="right"
                      style="
                        padding: 15px 0 10px;
                        font-size: 18px;
                        color: #007aff;
                        font-weight: bold;
                      "
                    >
                      {{totalBayar}}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                align="center"
                style="
                  padding: 30px 20px;
                  font-size: 12px;
                  color: #a9a9b3;
                  border-top: 1px solid #444444;
                  margin-top: 20px;
                "
              >
                <p style="margin: 0">
                  Email ini dibuat secara otomatis. Mohon tidak membalas email ini.
                </p>
                <p style="margin: 5px 0 0">&copy; 2025 Surya Yudha Cinema. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`

export const ticketSuccessfullyCreatedTemplate = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-Tiket Bioskop Anda</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: #f0f2f5;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #f0f2f5;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f0f2f5;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <!-- Kontainer Utama -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 25px 20px; background-color: #1a202c; color: #ffffff; border-top-left-radius: 12px; border-top-right-radius: 12px;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 600;">E-Tiket Anda Telah Terbit!</h1>
            </td>
          </tr>

          <!-- Konten Utama -->
          <tr>
            <td style="padding: 30px 25px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4a5568;">
                Halo {{namaUser}}, pembayaran Anda telah berhasil. Berikut adalah salah satu e-tiket Anda.
              </p>

              <!-- Detail Film -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                <tr>
                  <td style="padding-bottom: 15px; border-bottom: 1px solid #e2e8f0;">
                    <h2 style="margin: 0; font-size: 22px; color: #2d3748;">{{judulFilm}}</h2>
                    <p style="margin: 5px 0 0; font-size: 16px; color: #718096;">{{studioName}}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 15px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="50%" style="font-size: 14px; color: #718096;">JADWAL TAYANG</td>
                        <td width="50%" style="font-size: 14px; color: #718096;">SELESAI (Perkiraan)</td>
                      </tr>
                      <tr>
                        <td width="50%" style="font-size: 16px; color: #2d3748; font-weight: 600; padding-top: 4px;">{{jadwalTayang}}</td>
                        <td width="50%" style="font-size: 16px; color: #2d3748; font-weight: 600; padding-top: 4px;">{{jadwalSelesai}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Detail Tiket Spesifik -->
              <h3 style="margin: 0 0 15px; font-size: 18px; color: #2d3748; border-top: 1px solid #e2e8f0; padding-top: 25px;">Detail Tiket</h3>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 15px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 10px; font-size: 16px; color: #718096;">Kursi: <b style="color: #2d3748; font-size: 20px;">{{kursi}}</b></p>
                    <p style="margin: 0; font-size: 16px; color: #4a5568;">Kode Tiket:</p>
                    <p style="margin: 5px 0 0; font-size: 20px; color: #1a202c; font-weight: bold; letter-spacing: 2px; background-color: #f7fafc; padding: 10px; border-radius: 6px; text-align: center;">{{kodeTiket}}</p>
                  </td>
                </tr>
              </table>

              <!-- Informasi Penting -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 30px; background-color: #edf2f7; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px;">
                    <h4 style="margin: 0 0 10px; font-size: 16px; color: #2d3748;">Informasi Penting</h4>
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4a5568;">
                      Tunjukkan kode tiket di atas kepada petugas di ticket box untuk validasi. Mohon datang 15 menit sebelum film dimulai. Tiket yang sudah dibeli tidak dapat dibatalkan atau di-refund.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 25px 20px; font-size: 12px; color: #a0aec0; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0;">Terima kasih telah memilih Surya Yudha Cinema.</p>
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

export const paymentCancelledTemplate = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pemesanan Anda Dibatalkan</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: #f0f2f5;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #f0f2f5;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f0f2f5;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <!-- Kontainer Utama -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 25px 20px; background-color: #4A5568; color: #ffffff; border-top-left-radius: 12px; border-top-right-radius: 12px;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 600;">Pemesanan Dibatalkan</h1>
            </td>
          </tr>

          <!-- Konten Utama -->
          <tr>
            <td style="padding: 30px 25px;">
              <h2 style="margin: 0 0 15px; font-size: 22px; color: #2d3748;">Halo, {{namaUser}},</h2>
              <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.6; color: #4a5568;">
                Kami informasikan bahwa pemesanan tiket Anda telah dibatalkan karena pembayaran tidak berhasil diselesaikan atau telah melewati batas waktu.
              </p>
              <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.6; color: #4a5568;">
                Jangan khawatir, Anda bisa mencoba memesan kembali. Kursi yang sebelumnya Anda pilih kini telah tersedia kembali untuk umum.
              </p>

              <!-- Tombol Call to Action (CTA) -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="{{linkHalamanFilm}}" target="_blank" style="display: inline-block; padding: 15px 35px; font-size: 18px; font-weight: bold; color: #ffffff; background-color: #4299e1; border-radius: 8px; text-decoration: none;">
                      Coba Pesan Lagi
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Detail Booking yang Dibatalkan -->
          <tr>
            <td style="padding: 0 25px;">
              <h3 style="margin: 0 0 15px; font-size: 18px; color: #2d3748; border-top: 1px solid #e2e8f0; padding-top: 25px;">Detail Booking yang Dibatalkan</h3>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #718096;">Film</td>
                        <td align="right" style="padding: 8px 0; font-size: 15px; color: #2d3748; font-weight: 600;">{{judulFilm}}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #718096;">Kursi</td>
                        <td align="right" style="padding: 8px 0; font-size: 15px; color: #2d3748; font-weight: 600;">{{daftarKursi}}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #718096;">ID Pesanan</td>
                        <td align="right" style="padding: 8px 0; font-size: 15px; color: #2d3748; font-weight: 600;">{{orderId}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px 20px; font-size: 12px; color: #a0aec0;">
              <p style="margin: 0;">Jika Anda merasa ada kesalahan, silakan hubungi customer service kami.</p>
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
