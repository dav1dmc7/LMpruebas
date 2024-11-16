import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'TU_EMAIL@gmail.com', // Sustituye con tu correo
        pass: 'TU_CONTRASEÑA',      // Sustituye con tu contraseña
    },
});

const mailOptions = {
    from: 'TU_EMAIL@gmail.com',
    to: 'DESTINATARIO@gmail.com',  // Sustituye con el correo destinatario
    subject: 'Prueba de Nodemailer',
    text: 'Este es un correo de prueba enviado desde Nodemailer.',
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.error('Error al enviar el correo:', error);
    }
    console.log('Correo enviado:', info.response);
});
