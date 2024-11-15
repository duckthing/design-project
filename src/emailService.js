const nodemailer = require('nodemailer');

async function createTestAccount() {
    try {
        const testAccount = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
    } catch (error) {
        console.error('Error creating test account:', error);
        throw error;
    }
}

async function sendEventNotification(userEmail, eventDetails) {
    try {
        const transporter = await createTestAccount();
        
        const mailOptions = {
            from: '"Volunteer System" <noreply@volunteersystem.com>',
            to: userEmail,
            subject: `New Event: ${eventDetails.eventName}`,
            html: `
                <h2>New Volunteer Event Available</h2>
                <p>A new event has been created that matches your interests:</p>
                <ul>
                    <li>Event: ${eventDetails.eventName}</li>
                    <li>Date: ${new Date(eventDetails.eventDate).toLocaleString()}</li>
                    <li>Location: ${eventDetails.city}, ${eventDetails.stateCode}</li>
                </ul>
                <p>Log in to your account to view more details.</p>
            `
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        return info;
    } catch (error) {
        console.error('Error sending email to', userEmail);
        throw error;
    }
}

module.exports = { sendEventNotification }; 