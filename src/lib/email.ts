import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export async function sendEmail(
  to: string,
  subject: string,
  html: string
){
  try {
    await transporter.sendMail({
      from: `"Hospital App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    })

    console.log("✅ Email sent to:", to)

  } catch (err) {
    console.log("❌ Email error:", err)
    throw err
  }
}