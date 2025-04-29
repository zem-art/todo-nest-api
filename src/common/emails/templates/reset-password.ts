export function getResetPasswordHtml(RESET_URL: string, APP_NAME: string) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Reset Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 20px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Halo,</p>
        <p>We received a request to reset your account password. If this is you, please click the button below to reset your password :</p>
        <p style="text-align: center;">
          <a href="{{ RESET_URL }}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>
        <p>If you did not request a password reset, please ignore this email. This link will expire in 1 hour.</p>
        <br>
        <p>Thank You,</p>
        <p><strong>Support Team {{ APP_NAME }}</strong></p>
        <hr>
        <small>This email was sent automatically. Please do not reply to this email.</small>
      </div>
    </body>
  </html>
  `;
}
