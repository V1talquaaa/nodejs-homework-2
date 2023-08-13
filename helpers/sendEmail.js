const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASSWORD } = process.env;

const sendEmailMeta = async (data) => {
  const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
      user: "v1talquaaa@meta.ua",
      pass: META_PASSWORD,
    },
  };
  const transport = nodemailer.createTransport(nodemailerConfig);
  const email = {
    to: data.to,
    from: "v1talquaaa@meta.ua",
    subject: "Test email",
    html: data.html,
  };
  await transport
    .sendMail(email)
    .then(() => console.log("Verification email sent"))
    .catch((error) => console.log(error.message));
};
module.exports = sendEmailMeta;
