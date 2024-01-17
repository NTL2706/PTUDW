import nodemailer from 'nodemailer';
import configEnv from "../configs/configEnv.js"

async function warpedSendMail(mailOptions) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: configEnv.MAIL_USER_NAME,
                pass: configEnv.MAIL_PASSWORD
            }
        });

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("error is " + error);
                resolve(false);
            }
            else {
                console.log('Email sent: ' + info.response);
                resolve(mailOptions.text);
            }
        })

    })
}

const sendMail = async (toMail, subject, text) => {
    var mailOptions = {
        from: configEnv.MAIL_USER_NAME,
        to: toMail,
        subject: subject,
        text: text
    };
    let resp = await warpedSendMail(mailOptions);
    console.log(resp)
    return resp;
};

export { sendMail };
