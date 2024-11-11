// functions/process-form.js

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const formData = JSON.parse(event.body);

  // Verificar reCAPTCHA
  const recaptchaResponse = formData['g-recaptcha-response'];
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

  const response = await fetch(verificationUrl, { method: 'POST' });
  const data = await response.json();

  if (data.success) {
    // Procesar el formulario (enviar correo, guardar en Supabase, etc.)
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Formulario enviado correctamente.' }),
    };
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Error en reCAPTCHA.' }),
    };
  }
};
