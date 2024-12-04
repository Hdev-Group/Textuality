import * as AWS from "aws-sdk";
import * as nodemailer from "nodemailer";
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "eu-north-1",
});
AWS.config.getCredentials(function (error) {
    if (error) {
        console.log(error.stack);
    }
});
const ses = new AWS.SES({ apiVersion: "2010-12-01" });

// change this to the "to" email that you want
const adminMail = "support@textuality.hdev.uk";
// Create a transporter of nodemailer
const transporter = nodemailer.createTransport({
    SES: ses,
});
export const testMail = async (body) => {
    console.log("BODY", body);
    try {
        const response = await transporter.sendMail({
            from: adminMail,
            to: body.email,
            subject: `Support Request - ${body.title}`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            padding: 20px;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333333;
        }
        p {
            color: #555555;
            line-height: 1.6;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888888;
            text-align: start;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Support Request Confirmation</h2>
        <p>
            Dear ${body.firstname} ${body.lastname},
        </p>
        <p>
            Thank you for reaching out to us. This email confirms that we have received your support request. 
            Our team will review your query and get back to you as soon as possible.
        </p>
        <p>
            If you have additional details or updates related to your request, please feel free to reply to this email.
        </p>
        <p>
            Thank you for your patience and understanding.
        </p>
        <p>
            Best regards,<br/>
            Textuality Support Team
        </p>
        <div class="footer">
            This is an automated message. Please do not reply directly to this email.
        </div>
    </div>
</body>
</html>
`,
        });
        return response?.messageId
            ? { ok: true }
            : { ok: false, msg: "Failed to send email" };
    } catch (error) {
        console.log("ERROR", error.message);
        return { ok: false, msg: "Failed to send email" };
    }
};
