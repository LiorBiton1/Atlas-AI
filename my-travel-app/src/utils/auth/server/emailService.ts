import nodemailer from "nodemailer";

// Send Email Function
export async function sendPasswordResetEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
        service: "Gmail", // To be added: Add more email providers if needed
        secure: true, // Use SSL/TLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD // The apps password
        }
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || 'https://localhost:3000'}/auth?mode=resetPassword&reset_token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Atlas AI Password Reset Request",
       html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>You requested a password reset for your account.</p>
                <p>Click the button below to reset your password:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                    Reset Password
                </a>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all;">${resetUrl}</p>
                <p><strong>This link will expire in 1 hour.</strong></p>
                <p>If you didn't request this password reset, please ignore this email.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};