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
const adminMail = "no-reply@textuality.hdev.uk";
// Create a transporter of nodemailer
const transporter = nodemailer.createTransport({
    SES: ses,
});
export const testMail = async (body) => {
    console.log("BODY", body);
    const type = body.type;
    var response;
    try {
        if (type === "requestsubmitted") {
        response = await transporter.sendMail({
            from: `"Textuality Support" <${adminMail}>`,
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
            If you have additional details or updates related to your request, please contact us in the support portal.
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
    }  else if (type === "staffresponse") {
        response = await transporter.sendMail({
            from: `"Textuality Support" <${adminMail}>`,
            to: body.email,
            subject: `Support Request Update - ${body.title}`,
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
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <h2>Support Request Response</h2>
            <p>
                Hello ${body.firstname},
            </p>
            <p>
                Our team has responded to your support request titled: <b>${body.title}</b>. Please review the response and let us know if you need further assistance.
            </p>
            <p>
                You can view the response by logging into your account or contacting support directly.
            </p>
            <p>
                Thank you for reaching out to us.
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
    
    } else if (type === "awaitingresponse") {
        response = await transporter.sendMail({
        from: `"Textuality Support" <${adminMail}>`,
        to: body.email,
        subject: `Awaiting Your Response - ${body.title}`,
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
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Response Needed</h2>
        <p>
            Hello ${body.firstname},
        </p>
        <p>
            We’re waiting for your response regarding your support request titled: <b>${body.title}</b>. Kindly provide the requested information so we can proceed further.
        </p>
        <p>
            If you no longer need assistance, please let us know.
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
        `
    });
} else if (type === "closed") {
    response = await transporter.sendMail({
        from: `"Textuality Support" <${adminMail}>`,
        to: body.email,
        subject: `Support Request Closed - ${body.title}`,
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
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Support Request Closed</h2>
        <p>
            Hello ${body.firstname},
        </p>
        <p>
            Your support request titled: <b>${body.title}</b> has been marked as resolved and is now closed. 
        </p>
        <p>
            If you believe this is a mistake or need further assistance, please contact us again, and we’ll be happy to assist you.
        </p>
        <p>
            Thank you for using our support service.
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
}
        return response?.messageId
            ? { ok: true }
            : { ok: false, msg: "Failed to send email" };
    } catch (error) {
        console.log("ERROR", error.message);
        return { ok: false, msg: "Failed to send email" };
    }
};
