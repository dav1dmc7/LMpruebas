const nodemailer = require('nodemailer');
const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    console.log("Método HTTP recibido:", event.httpMethod);
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: { 'Allow': 'POST' },
        body: JSON.stringify({ message: 'Método no permitido' }),
      };
    }

    // Parsear los datos
    const data = JSON.parse(event.body);
    const { nombre, email, mensaje, 'g-recaptcha-response': recaptchaResponse } = data;

    // Validar campos requeridos
    if (!nombre || !email || !mensaje || !recaptchaResponse) {
      throw new Error('Todos los campos son obligatorios');
    }

    // Verificar reCAPTCHA
    const recaptchaValidation = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`,
      { method: 'POST' }
    );
    const recaptchaJson = await recaptchaValidation.json();
    if (!recaptchaJson.success) {
      throw new Error('Verificación de reCAPTCHA fallida');
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
      to: process.env.EMAIL_USER,
      subject: `Nueva consulta de ${nombre}`,
      text: `Nombre: ${nombre}\nEmail: ${email}\nMensaje: ${mensaje}`,
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Correo enviado correctamente' }),
    };
  } catch (error) {
    console.error("Error procesando formulario:", error.message);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Error procesando formulario', details: error.message }),
    };
  }
};
