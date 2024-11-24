const nodemailer = require('nodemailer');
const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    // Solo aceptar solicitudes POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: { 'Allow': 'POST' },
        body: JSON.stringify({ message: 'Método no permitido' }),
      };
    }

    const data = JSON.parse(event.body);
    const { nombre, email, mensaje, 'g-recaptcha-response': recaptchaResponse } = data;

    if (!nombre || !email || !mensaje || !recaptchaResponse) {
      throw new Error('Todos los campos son obligatorios');
    }

    // Verificar reCAPTCHA
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaResponse}`;

    const recaptchaValidation = await fetch(recaptchaUrl, { method: 'POST' });
    const recaptchaJson = await recaptchaValidation.json();

    if (!recaptchaJson.success) {
      throw new Error('Verificación de reCAPTCHA fallida.');
    }

    // Configurar Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL,
      subject: 'Nueva solicitud de contacto',
      text: `Has recibido una nueva solicitud de contacto:\n\nNombre: ${nombre}\nEmail: ${email}\nMensaje: ${mensaje}`,
    };

    // Enviar correo
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
    console.error('Error al procesar el formulario:', error.message);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Error al procesar el formulario' }),
    };
  }
};
