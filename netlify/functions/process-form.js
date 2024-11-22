require('dotenv').config();

const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const { nombre, email, mensaje } = data;

    console.log('Datos recibidos:', data); // Imprimir datos recibidos

    // Configurar Nodemailer para enviar correo con Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verificar conexión antes de enviar el correo
    transporter.verify(function (error, success) {
      if (error) {
        console.error('Error de conexión con el servidor de correo:', error);
      } else {
        console.log('Servidor listo para enviar correos');
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL,
      subject: 'Nueva solicitud de contacto',
      text: `Has recibido una nueva solicitud de contacto:\n\nNombre: ${nombre}\nEmail: ${email}\nMensaje: ${mensaje}`,
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Correo enviado correctamente' }),
    };
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Error al enviar el correo' }),
    };
  }
};
