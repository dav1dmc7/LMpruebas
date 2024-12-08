const nodemailer = require('nodemailer');
const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    // Verificar que la solicitud sea POST
    console.log("Método HTTP recibido:", event.httpMethod);
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: { 'Allow': 'POST' },
        body: JSON.stringify({ message: 'Método no permitido' }),
      };
    }

    // Parsear los datos del cuerpo de la solicitud
    console.log("Cuerpo recibido:", event.body);
    const data = JSON.parse(event.body);
    const { nombre, email, mensaje, 'g-recaptcha-response': recaptchaResponse } = data;

    // Validar que los campos requeridos estén presentes
    if (!nombre || !email || !mensaje || !recaptchaResponse) {
      console.error("Campos faltantes:", { nombre, email, mensaje, recaptchaResponse });
      throw new Error('Todos los campos son obligatorios');
    }

    // Verificar reCAPTCHA
    console.log("Verificando reCAPTCHA...");
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaResponse}`;

    const recaptchaValidation = await fetch(recaptchaUrl, { method: 'POST' });
    const recaptchaJson = await recaptchaValidation.json();
    console.log("Respuesta de reCAPTCHA:", recaptchaJson);

    if (!recaptchaJson.success) {
      throw new Error('Verificación de reCAPTCHA fallida');
    }

    // Configurar Nodemailer
    console.log("Configurando Nodemailer...");
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
    console.log("Enviando correo...");
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente");

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Correo enviado correctamente' }),
    };
  } catch (error) {
    console.error("Error procesando el formulario:", error.message);
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
