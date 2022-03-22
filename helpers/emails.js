import nodemailer from "nodemailer";

export const registerEmail = async (data) => {
  const { name, token, email } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transport.sendMail({
    from: '"Proyect Manager" <cuentas@uptask.com>',
    to: email,
    subject: "Proyect Manager confirm account",
    text: "Proyect Manager confirm account",
    html: `<p>Hi! ${name}</p>
           <p>
           Your account is almost ready, confirm it in the following link:
           <a href="${process.env.FRONTEND_URL}/confirm/${token}">Check account</a>
           </p>
        `,
  });
};

export const forgotPasswordEmail = async (data) => {
  const { name, token, email } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transport.sendMail({
    from: '"Proyect Manager" <cuentas@uptask.com>',
    to: email,
    subject: "Proyect Manager regenerate password",
    text: "Proyect Manager regenerate password",
    html: `<p>Hi! ${name}, for regenerate password follow next link </p>
           <p>           
           <a href="${process.env.FRONTEND_URL}/new-password/${token}">Regenerate password</a>
           </p>
        `,
  });
};
