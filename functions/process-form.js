// process-form.js

const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  try {
    // Verificar el método HTTP
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Método no permitido' }),
      };
    }

    // Procesar los datos del formulario
    const formData = new URLSearchParams(event.body);

    // Validar reCAPTCHA
    const recaptchaResponse = formData.get('g-recaptcha-response');
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const recaptchaRes = await fetch(verificationUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`,
    });

    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success) {
      console.error('Fallo en reCAPTCHA:', recaptchaData['error-codes']);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Error en reCAPTCHA.' }),
      };
    }

    // Configuración de Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insertar datos en Supabase
    const nombre = formData.get('nombre');
    const email = formData.get('email');
    const mensaje = formData.get('mensaje');

    const { error } = await supabase.from('clientes').insert([{ nombre, email, mensaje }]);
    if (error) {
      console.error('Error al guardar en la base de datos:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error al guardar en la base de datos.' }),
      };
    }

    // Configuración de Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // Correo electrónico
        pass: process.env.EMAIL_PASS, // Contraseña o App Password
      },
    });

    // Contenido del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL, // Correo electrónico de destino
      subject: 'Nuevo mensaje desde López Márquez Abogados',
      text: `Has recibido un nuevo mensaje de ${nombre} (${email}):\n\n${mensaje}`,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Formulario enviado y correo enviado correctamente.' }),
    };
  } catch (error) {
    console.error('Error inesperado:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error en el servidor.' }),
    };
  }
};
