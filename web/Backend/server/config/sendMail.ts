const formData = require("form-data");
const Mailgun = require("mailgun.js");

const API_KEY = process.env.NODEMON_PRIVATE_API;
const DOMAIN = process.env.NODEMON_DOMAIN;

const sendEmail = async (to: string, url: string, txt: string) => {
  const mailgun = new Mailgun(formData);
  const client = mailgun.client({ username: "api", key: API_KEY });
  (to);
  const messageData = {
    from: "PediaGeek <signup@pediageek.com>",
    to,
    subject: "PediaGeek",
    html: `
              <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
              <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the <b>PEDIA<span style="color:green;">GEEK</span></b>.</h2>
              <p>Congratulations! You're almost set to start using <b>PEDIA<span style="color:green;">GEEK</span></b>.
                  Just click the button below to validate your email address.
              </p>

              <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>

              <p>If the button doesn't work for any reason, you can also click on the link below:</p>

              <div>${url}</div>
              </div>
            `,
  };

  client.messages
    .create(DOMAIN, messageData)
    .then((res: any) => {
      (res);
    })
    .catch((err: any) => {
      console.error(err);
    });
};

export default sendEmail;

// const oAuth2Client = new OAuth2Client(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   OAUTH_PLAYGROUND
// );

// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// try {
//   const access_token = await oAuth2Client.getAccessToken();

//   const transport = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       type: "OAuth2",
//       user: SENDER_MAIL,
//       clientId: CLIENT_ID,
//       clientSecret: CLIENT_SECRET,
//       refreshToken: REFRESH_TOKEN,
//       access_token,
//     },
//   });

//   const mailOptions = {
//     from: SENDER_MAIL,
//     to: to,
//     subject: "PediaGeek",
// html: `
//         <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
//         <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the <b>PEDIA<span style="color:green;">GEEK</span></b>.</h2>
//         <p>Congratulations! You're almost set to start using <b>PEDIA<span style="color:green;">GEEK</span></b>.
//             Just click the button below to validate your email address.
//         </p>

//         <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>

//         <p>If the button doesn't work for any reason, you can also click on the link below:</p>

//         <div>${url}</div>
//         </div>
//       `,
//   };

//   const result = await transport.sendMail(mailOptions);
//   return result;
// } catch (err) {
//   (err);
// }
