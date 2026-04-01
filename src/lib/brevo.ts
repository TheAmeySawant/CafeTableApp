export async function sendOtpEmail(email: string, otp: string) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[LOCAL DEV] OTP for ${email} is ${otp}`);
      return { success: true };
    }
    throw new Error('BREVO_API_KEY is missing');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': brevoApiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: process.env.BREVO_FROM_NAME || 'CafeApp Team',
        email: process.env.BREVO_FROM_EMAIL || 'noreply@cafeapp.local',
      },
      to: [
        {
          email: email,
        },
      ],
      subject: 'Your CafeApp Login Code',
      htmlContent: `<html><body><h1>Your OTP is ${otp}</h1><p>This code will expire in 10 minutes.</p></body></html>`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Brevo API Error:', errorText);
    throw new Error('Failed to send email OTP');
  }

  return await response.json();
}
