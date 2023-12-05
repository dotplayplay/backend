exports.sendCode = function (email, verificationToken) {
  const mailOptions = {
    from: "your_email@gmail.com",
    to: email,
    subject: "Email Verification",
    html: `Please click <a href="http://yourwebsite.com/verify?token=${verificationToken}">here</a> to verify your email.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res
        .status(500)
        .json({ message: "Error sending verification email" });
    }
    console.log("Email sent:", info.response);
    return res
      .status(200)
      .json({ message: "Verification email sent successfully" });
  });
};
