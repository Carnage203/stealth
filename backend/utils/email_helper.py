import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

load_dotenv()

def send_activation_email(name:str, email: str, token: str):
    app_name = os.getenv("APP_NAME")
    activation_link = f"{os.getenv('FRONTEND_URL')}/doctor-registration?token={token}"

    html_body = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete Your Registration</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                            <h1 style="margin: 0; color: #1f2937; font-size: 28px; font-weight: 600;">Welcome to {app_name}!</h1>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                                Hi {name},
                            </p>
                            <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                                Thank you for signing up! We're excited to have you on board. To complete your registration and get started, please verify your email address by clicking the button below.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="text-align: center; padding: 20px 0;">
                                        <a href="{activation_link}" style="display: inline-block; padding: 14px 40px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Complete Registration</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Alternative Link -->
                            <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                Or copy and paste this link into your browser:
                            </p>
                            <p style="margin: 10px 0 0; padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; word-break: break-all;">
                                <a href="{activation_link}" style="color: #3b82f6; text-decoration: none; font-size: 14px;">{activation_link}</a>
                            </p>
                            
                            <!-- Expiration Notice -->
                            <p style="margin: 30px 0 0; color: #ef4444; font-size: 14px; line-height: 1.6;">
                                ⏱️ This link will expire in 24 hours.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
                                If you didn't create an account with {app_name}, you can safely ignore this email.
                            </p>
                            <p style="margin: 15px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
                                © 2025 {app_name}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""
    text_body = f"""
    Welcome, {name}!

    Thank you for signing up for {app_name}. Click the link below to complete your registration:
    {activation_link}

    This link expires in 24 hours.

    If you didn't request this, please ignore this email.
    """
    
    # msg = MIMEText(body)
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Activate your account"
    # msg["From"] = os.getenv("EMAIL_FROM")
    msg["From"] = f"{app_name} <{os.getenv('EMAIL_ADDRESS')}>"
    msg["To"] = email

    # Attach both versions - email clients will choose which to display
    part1 = MIMEText(html_body,"html")
    part2 = MIMEText(text_body, "plain")
    msg.attach(part1)
    # msg.attach(part2)

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(os.getenv("EMAIL_ADDRESS"), os.getenv("EMAIL_PASSWORD"))
            server.send_message(msg)
        print(f"Activation email sent to {email}")
    except Exception as e:
        print(f"Failed to send email: {e}") 


def send_reset_password_email(name: str, email: str, token: str):
    app_name = os.getenv("APP_NAME")
    reset_link = f"{os.getenv('FRONTEND_URL')}/reset-password?token={token}"

    html_body = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); overflow: hidden;">

                    <!-- Top Accent Bar -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); height: 5px; font-size: 0; line-height: 0;">&nbsp;</td>
                    </tr>

                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 48px 28px; text-align: center;">
                            <!-- Lock Icon -->
                            <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; background-color: #eff6ff; border-radius: 50%; margin-bottom: 20px;">
                                <span style="font-size: 28px;">🔐</span>
                            </div>
                            <h1 style="margin: 0; color: #111827; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                                Reset Your Password
                            </h1>
                            <p style="margin: 8px 0 0; color: #6b7280; font-size: 15px;">
                                {app_name} · Account Security
                            </p>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 48px;">
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0;">
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 36px 48px;">
                            <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
                                Hi <strong>{name}</strong>,
                            </p>
                            <p style="margin: 0 0 28px; color: #374151; font-size: 15px; line-height: 1.7;">
                                We received a request to reset the password for your <strong>{app_name}</strong> account. 
                                Click the button below to create a new password. This link is valid for <strong>1 hour</strong>.
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="text-align: center; padding: 8px 0 32px;">
                                        <a href="{reset_link}"
                                           style="display: inline-block; padding: 15px 44px; background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.2px; box-shadow: 0 4px 12px rgba(59,130,246,0.35);">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Expiry Notice -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="background-color: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 18px;">
                                        <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.6;">
                                            ⏱️ <strong>This link expires in 1 hour.</strong> 
                                            If it expires, you can request a new one from the login page.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Alternative Link -->
                            <p style="margin: 28px 0 8px; color: #6b7280; font-size: 13px;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="margin: 0; padding: 12px 16px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; word-break: break-all;">
                                <a href="{reset_link}" style="color: #3b82f6; text-decoration: none; font-size: 13px;">
                                    {reset_link}
                                </a>
                            </p>
                        </td>
                    </tr>

                    <!-- Security Notice -->
                    <tr>
                        <td style="padding: 0 48px 36px;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 18px;">
                                        <p style="margin: 0; color: #166534; font-size: 13px; line-height: 1.6;">
                                            🛡️ <strong>Didn't request this?</strong> 
                                            If you didn't request a password reset, please ignore this email. 
                                            Your password will remain unchanged and your account is safe.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 48px;">
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0;">
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 28px 48px; background-color: #f9fafb;">
                            <p style="margin: 0 0 6px; color: #6b7280; font-size: 13px; line-height: 1.6;">
                                This email was sent to <a href="mailto:{email}" style="color: #3b82f6; text-decoration: none;">{email}</a> 
                                because a password reset was requested for your {app_name} account.
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                © 2026 {app_name}. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""

    text_body = f"""
Hi {name},

We received a request to reset your {app_name} account password.

Reset your password using this link:
{reset_link}

This link expires in 1 hour.

If you didn't request this, please ignore this email. Your password will not change.

© 2026 {app_name}. All rights reserved.
"""


    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Reset your {app_name} password"
    msg["From"] = f"{app_name} <{os.getenv('EMAIL_ADDRESS')}>"
    msg["To"] = email

    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(os.getenv("EMAIL_ADDRESS"), os.getenv("EMAIL_PASSWORD"))
            server.send_message(msg)
        print(f"Password reset email sent to {email}")
    except Exception as e:
        print(f"Failed to send reset email: {e}")

if __name__ == "__main__":
    # Test the email function
    test_email = "abhishek20dgp@gmail.com"
    test_token = "sampletoken123"
    send_activation_email(test_email, test_token)