import nodemailer from 'nodemailer';

export const sendEmail = async ({ email, subjectType, resetLink,
   verifyCode }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jayeshgondaliya9929@gmail.com",
      pass: "joookydwaugigjzh"
    }
  });

  let subject = "";
  let html = "";

  if (subjectType === "reset") {
    subject = "Reset Your Password - e-commerce";
    html = `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p style="color: #555;">You recently requested to reset your password. Click the button below to reset it.</p>
        <a href="${resetLink}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p style="margin-top: 30px; color: #999;">If you did not request a password reset, please ignore this email.</p>
      </div>
    `;
  } else if (subjectType === "verify") {
    subject = "Verify Your Email - e-commerce";
    html = `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2 style="color: #333;">Email Verification Code</h2>
        <p style="color: #555;">Use the verification code below to verify your email address:</p>
        <h1 style="color: #4CAF50;">${verifyCode}</h1>
        <h1 style="color: red;">This is valid for only 10 minutes</h1>

        <p style="margin-top: 30px; color: #999;">If you did not register for an account, please ignore this email.</p>
      </div>
    `;
  }

  const mailOptions = {
    from: "jayeshgondaliya9929@gmail.com",
    to: email,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};
