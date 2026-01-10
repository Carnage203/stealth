import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os

load_dotenv()

def send_activation_email(email: str, token: str):
    activation_link = f"{os.getenv('FRONTEND_URL')}/activate?token={token}"

    body = f"""
    Welcome!

    Click the link below to activate your account:
    {activation_link}

    This link expires in 24 hours.
    """

    msg = MIMEText(body)
    msg["Subject"] = "Activate your account"
    msg["From"] = os.getenv("EMAIL_FROM")
    msg["To"] = email
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