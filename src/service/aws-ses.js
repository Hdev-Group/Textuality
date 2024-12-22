import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";
import * as nodemailer from "nodemailer";

// SES Client
const sesClient = new SESClient({
    region: "eu-north-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Nodemailer transporter with custom send function
const transporter = nodemailer.createTransport({
    SES: {
        ses: sesClient,
        aws: { SendRawEmailCommand },
    },
});


// change this to the "to" email that you want
const adminMail = "no-reply@textuality.hdev.uk";
const welcomeMail = "team@textuality.hdev.uk";

export const testMail = async (body) => {
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
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        h2 {
            color: #333333;
            margin-top: 0;
        }
        p {
            color: #555555;
            line-height: 1.6;
        }
        .outer-table {
            width: 100%;
            margin-top: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background-color: #f9f9f9;
        }
        .profile-img {
            width: 50px;
            height: 50px;
            border-radius: 100%;
            display: block;
            margin: 10px auto;
        }
        .badge {
            font-size: 0.75rem;
            font-weight: bold;
            padding: 5px 10px;
            border-radius: 12px;
            display: inline-block;
        }
        .status-open {
            background-color: #d1fae5;
            color: #047857;
        }
        .status-high {
            background-color: #fee2e2;
            color: #b91c1c;
        }
        .priority-low {
            background-color: rgba(96, 165, 250, 0.2);
            color: #60a5fa; 
        }
        .priority-medium {
            background-color: rgba(250, 204, 21, 0.2);
            color: #facc15;
        }
        .priority-high {
            background-color: rgba(248, 113, 113, 0.2);
            color: #f87171; 
        }
        .button{
            background-color: #0077ff;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            width: 100%;
        }
        .button a{
            color: white;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Support Request Confirmation</h2>
        <p>Dear ${body.firstname} ${body.lastname},</p>
        <p>
            Thank you for reaching out to us. This email confirms that we have received your support request. 
            Our team will review your query and get back to you as soon as possible. 
            If you have any other questions or concerns, please feel free to contact us on our support portal.
        </p>

        <table class="outer-table" cellpadding="10">
            <tr>
                <td style="width: 60px; text-align: center;">
                    <img src="${body.imageUrl}" alt="Profile Picture" class="profile-img">
                </td>
                <td>
                    <strong>${body.firstname} ${body.lastname}</strong><br>
                    <span>${body.datetime}</span><br>
                    <p>${body.description || 'No description provided'}</p>
                </td>
            </tr>
            <tr>
                <td style="text-align: right;"><strong>Status:</strong></td>
                <td><span class="badge status-${body.status.toLowerCase()}">${body.status}</span></td>
            </tr>
            <tr>
                <td style="text-align: right;"><strong>Priority:</strong></td>
                <td><span class="badge priority-${body.priority.toLowerCase()}">${body.priority}</span></td>
            </tr>
        </table>
        <p class="footer">
            This is an automated message. Please do not reply directly to this email.
        </p>
        <a href="https://textuality.hdev.uk/support/" class="button">
            View Request
        </a>
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
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        h2 {
            color: #333333;
            margin-top: 0;
        }
        p {
            color: #555555;
            line-height: 1.6;
        }
        .outer-table {
            width: 100%;
            margin-top: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background-color: #f9f9f9;
        }
        .profile-img {
            width: 50px;
            height: 50px;
            border-radius: 100%;
            display: block;
            margin: 10px auto;
        }
        .badge {
            font-size: 0.75rem;
            font-weight: bold;
            padding: 5px 10px;
            border-radius: 12px;
            display: inline-block;
        }
        .status-open {
            background-color: #d1fae5;
            color: #047857;
        }
        .status-high {
            background-color: #fee2e2;
            color: #b91c1c;
        }
        .priority-low {
            background-color: rgba(96, 165, 250, 0.2);
            color: #60a5fa; 
        }
        .priority-medium {
            background-color: rgba(250, 204, 21, 0.2);
            color: #facc15;
        }
        .priority-high {
            background-color: rgba(248, 113, 113, 0.2);
            color: #f87171; 
        }
        .button{
            background-color: #0077ff;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            width: 100%;
        }
        .button a{
            color: white;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Support Team Responded</h2>
        <p>Dear ${body.firstname} ${body.lastname},</p>
        <p>
            We have responded to your support request titled: <b>${body.title}</b>. Please review the response and let us know if you need further assistance.
        </p>

        <table class="outer-table" cellpadding="10">
            <tr>
                <td style="width: 60px; text-align: center;">
                    <img src="${body.imageUrl}" alt="Profile Picture" class="profile-img">
                </td>
                <td>
                    <strong>Textuality Support</strong><br>
                    <span>${body.datetime}</span><br>
                    <p>${body.description || 'No description provided'}</p>
                </td>
            </tr>
        </table>

        <p class="footer">
            This is an automated message. Please do not reply directly to this email.
        </p>
        <a href="https://textuality.hdev.uk/support/" class="button">
            View Request
        </a>
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
        .button{
            background-color: #0077ff;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            width: 100%;
        }
        .button a{
            color: white;
            text-decoration: none;
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
        <a href="https://textuality.hdev.uk/support/" class="button">
            View Request
        </a>
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
} else if (type === "statuschange") {
    response = await transporter.sendMail({
        from: `"Textuality Support" <${adminMail}>`,
        to: body.email,
        subject: `Status Changed - ${body.title}`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        h2 {
            color: #333333;
            margin-top: 0;
        }
        p {
            color: #555555;
            line-height: 1.6;
        }
        .outer-table {
            width: 100%;
            margin-top: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background-color: #f9f9f9;
        }
        .profile-img {
            width: 50px;
            height: 50px;
            border-radius: 100%;
            display: block;
            margin: 10px auto;
        }
        .badge {
            font-size: 0.75rem;
            font-weight: bold;
            padding: 5px 10px;
            border-radius: 12px;
            display: inline-block;
        }
        .status-open {
            background-color: #d1fae5;
            color: #047857;
        }
        .status-high {
            background-color: #fee2e2;
            color: #b91c1c;
        }
        .priority-low {
            background-color: rgba(96, 165, 250, 0.2);
            color: #60a5fa; 
        }
        .priority-medium {
            background-color: rgba(250, 204, 21, 0.2);
            color: #facc15;
        }
        .priority-high {
            background-color: rgba(248, 113, 113, 0.2);
            color: #f87171; 
        }
        .button{
            background-color: #0077ff;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            width: 100%;
        }
        .button a{
            color: white;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Support Request Updated Status</h2>
        <p>Dear ${body.firstname} ${body.lastname},</p>
        <p>
            The statuschange of your support request titled: <b>${body.title}</b> has been changed to <b>${body.status}</b>.
        </p>

        <table class="outer-table" cellpadding="10">
            <tr>
                <td style="width: 60px; text-align: center;">
                    <img src="${body.imageUrl}" alt="Profile Picture" class="profile-img">
                </td>
                <td>
                    <strong>${body.firstname} ${body.lastname}</strong><br>
                    <span>${body.datetime}</span><br>
                    <p>${body.description || 'No description provided'}</p>
                </td>
            </tr>
            <tr>
                <td style="text-align: right;"><strong>Status:</strong></td>
                <td><span class="badge status-${body.status.toLowerCase()}">${body.status}</span></td>
            </tr>
            <tr>
                <td style="text-align: right;"><strong>Priority:</strong></td>
                <td><span class="badge priority-${body.priority.toLowerCase()}">${body.priority}</span></td>
            </tr>
        </table>

        <p class="footer">
            This is an automated message. Please do not reply directly to this email.
        </p>
        <a href="https://textuality.hdev.uk/support/" class="button">
            View Request
        </a>
    </div>
</body>
</html>
`
});
} else if (type === "prioritychange") {
    response = await transporter.sendMail({
        from: `"Textuality Support" <${adminMail}>`,
        to: body.email,
        subject: `Priority Changed - ${body.title}`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        h2 {
            color: #333333;
            margin-top: 0;
        }
        p {
            color: #555555;
            line-height: 1.6;
        }
        .outer-table {
            width: 100%;
            margin-top: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background-color: #f9f9f9;
        }
        .profile-img {
            width: 50px;
            height: 50px;
            border-radius: 100%;
            display: block;
            margin: 10px auto;
        }
        .badge {
            font-size: 0.75rem;
            font-weight: bold;
            padding: 5px 10px;
            border-radius: 12px;
            display: inline-block;
        }
        .status-open {
            background-color: #d1fae5;
            color: #047857;
        }
        .status-high {
            background-color: #fee2e2;
            color: #b91c1c;
        }
        .priority-low {
            background-color: rgba(96, 165, 250, 0.2);
            color: #60a5fa; 
        }
        .priority-medium {
            background-color: rgba(250, 204, 21, 0.2);
            color: #facc15;
        }
        .priority-high {
            background-color: rgba(248, 113, 113, 0.2);
            color: #f87171; 
        }
        .button{
            background-color: #0077ff;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            width: 100%;
        }
        .button a{
            color: white;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Support Request Updated Priority</h2>
        <p>Dear ${body.firstname} ${body.lastname},</p>
        <p>
            The priority of your support request titled: <b>${body.title}</b> has been changed to <b>${body.priority}</b>.
        </p>

        <table class="outer-table" cellpadding="10">
            <tr>
                <td style="width: 60px; text-align: center;">
                    <img src="${body.imageUrl}" alt="Profile Picture" class="profile-img">
                </td>
                <td>
                    <strong>${body.firstname} ${body.lastname}</strong><br>
                    <span>${body.datetime}</span><br>
                    <p>${body.description || 'No description provided'}</p>
                </td>
            </tr>
            <tr>
                <td style="text-align: right;"><strong>Status:</strong></td>
                <td><span class="badge status-${body.status.toLowerCase()}">${body.status}</span></td>
            </tr>
            <tr>
                <td style="text-align: right;"><strong>Priority:</strong></td>
                <td><span class="badge priority-${body.priority.toLowerCase()}">${body.priority}</span></td>
            </tr>
        </table>

        <p class="footer">
            This is an automated message. Please do not reply directly to this email.
        </p>
        <a href="https://textuality.hdev.uk/support/" class="button">
            View Request
        </a>
    </div>
</body>
</html>
`
});
} else if (type === "welcome") {
    response = await transporter.sendMail({
        from: `"Textuality Team" <${welcomeMail}>`,
        to: body.email,
        subject: `Welcome to Textuality`,
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
            margin: 0 20px;
            margin-bottom: 20px;
        }
        .topwelcome {
            background: linear-gradient(90deg, #F5F5F5  , #FFFFFF);
            padding: 10px;
            margin-bottom: 20px;
            border-bottom: 1px solid #0000001a;
            color: black;
            display: flex;
            justify-content: center;
            font-size: 25px;
            align-items: center;
        }
        .otherinfo {
            padding: 0px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .logoholder{
            background-color: #000;
            border-radius: 8px 8px 0 0;
            display: flex;
            align-items: center;
            padding: 10px;
            color: #ffffff;
        }
        .button {
            background-color: rgb(0, 119, 255);
            color: white;
            padding: 10px 0;
            font-weight: 600;
            font-size: large;
            border-radius: 5px;
            text-align: center;
            margin-top: 20px;
            width: 100%;
            display: inline-block;
            text-decoration: none;
        }
        .button:hover {
            background-color: rgb(0, 100, 255);
        }
        .lowerfooter {
            background-color: #f9f9f9;
            padding: 10px;
            text-align: center;
            font-size: 14px;
            color: #888888;
        }
        a {
            color: #0077ff;
            cursor: pointer;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="logoholder">
            <img src="/light-removebg-preview.png" alt="Textuality Logo" style="width: 100px; height: auto;">
        </div>
        <div class="topwelcome">
            <h2 style="color: black;">Welcome to Textuality!</h2>
        </div>
        <div class="otherinfo">
            <p>
                Hello ${body.firstname} ${body.lastname},
            </p>
            <p>
                Welcome to Textuality! We are excited to have you on board. Now you can begin to create your content and share it on your site.
            </p>
            <a style="width: 100%;">
                <div class="button">
                    Get Started
                </div>
            </a>
        </div>
        <div class="footer">
            This is an automated message. Please do not reply directly to this email.
        </div>
    </div>
    <div class="lowerfooter">
        <a>Go to Textuality</a> | <a>Support Center</a>
    </div>
</body>
</html>
`,});
    }
        return response?.messageId
            ? { ok: true }
            : { ok: false, msg: "Failed to send email" };
    } catch (error) {
        return { ok: false, msg: "Failed to send email" };
    }
};
