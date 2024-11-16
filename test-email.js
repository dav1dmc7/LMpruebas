import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lopezmarquezabogados@gmail.com',
        pass: 'twfj edqr uhvm urdk', // Contraseña generada de aplicación
    },
});

const mailOptions = {
    from: 'lopezmarquezabogados@gmail.com',
    to: 'lopezmarquezabogados@gmail.com',
    subject: 'Prueba de Nodemailer',
    text: 'Esto es un mensaje de prueba desde Nodemailer.',
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error al enviar correo:', error);
    } else {
        console.log('Correo enviado correctamente:', info.response);
    }
});
