const nodemailer = require('nodemailer');
const formData = require('form-data');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' })
        };
    }

    const form = new formData();
    form.append('job_position', event.body.job_position);
    form.append('name', event.body.name);
    form.append('email', event.body.email);
    form.append('message', event.body.message);

    const attachments = ['cv', 'certificates', 'cover_letter'];
    for (const file of attachments) {
        if (event.body[file]) {
            form.append(file, event.body[file].buffer, { filename: event.body[file].originalname });
        }
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    const mailOptions = {
        from: event.body.email,
        to: 'mozamatch@gmail.com',
        subject: `Nova Candidatura - ${event.body.job_position}`,
        text: `Nome: ${event.body.name}\nEmail: ${event.body.email}\nVaga: ${event.body.job_position}\nMensagem: ${event.body.message}`,
        attachments: form.getAttachments()
    };

    try {
        await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Candidatura submetida com sucesso!' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao submeter a candidatura.' })
        };
    }
};
