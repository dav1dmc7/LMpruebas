const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  try {
    console.log('Iniciando función process-form');

    // Verificar el método HTTP
    if (event.httpMethod !== 'POST') {
      console.log('Método no permitido:', event.httpMethod);
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Método no permitido' }),
      };
    }

    // Procesar los datos del formulario
    const formData = new URLSearchParams(event.body);
    const nombre = formData.get('nombre');
    const email = formData.get('email');
    const mensaje = formData.get('mensaje');
    const recaptchaResponse = formData.get('g-recaptcha-response');

    // Validación de campos del formulario
    if (!nombre || !email || !mensaje || !recaptchaResponse) {
      console.error('Todos los campos del formulario deben estar completos');
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Por favor, completa todos los campos.' }),
      };
    }

    // Validar reCAPTCHA
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
    if (!supabaseUrl || !supabaseKey) {
      console.error('Variables de entorno para Supabase no configuradas');
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error en la configuración de la base de datos.' }),
      };
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insertar datos en Supabase
    const { error } = await supabase.from('clientes').insert([{ nombre, email, mensaje }]);
    if (error) {
      console.error('Error al guardar en la base de datos:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error al guardar en la base de datos.' }),
      };
    }
    console.log('Datos guardados en Supabase correctamente');

    // Configuración de Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Contenido del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL,
      subject: 'Nuevo mensaje desde López Márquez Abogados',
      text: `Has recibido un nuevo mensaje de ${nombre} (${email}):\n\n${mensaje}`,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado correctamente');

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
