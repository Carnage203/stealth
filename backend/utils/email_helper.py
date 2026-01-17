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

if __name__ == "__main__":
    # Test the email function
    test_email = "abhishek20dgp@gmail.com"
    test_token = "sampletoken123"
    send_activation_email(test_email, test_token)