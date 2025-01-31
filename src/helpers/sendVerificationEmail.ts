import { render } from '@react-email/render';
import { ApiResponse } from "@/types/ApiResponse";
import nodemailer from "nodemailer";
import VerificationEmail from "../../emails/verificationEmail";

// Create a reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // You can replace this with the service you're using (e.g., 'Outlook', 'Yahoo', etc.)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or an app-specific password
  },
});

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Render the VerificationEmail component to an HTML string
    const emailHtml = await render(VerificationEmail({ username, otp: verifyCode }));
    console.log(emailHtml);

    // Send the email using the transporter
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Sender's email address
      to: email, // Recipient's email address
      subject: 'Strange Message | Verification Code',
      html: emailHtml, // Pass the rendered HTML as the email content
    });

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}