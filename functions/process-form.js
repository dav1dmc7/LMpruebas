import nodemailer from 'nodemailer';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

export async function handler(event) {
  try {
    const formData = new URLSearchParams(event.body);
    const { nombre, email, mensaje } = Object.fromEntries(formData.entries());

    // Configuración de Supabase
    const supabaseUrl = 'https://jnkluabtktatvtsbfamn.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insertar datos en Supabase
    const { error } = await supabase.from('clientes').insert([{ nombre, email, mensaje }]);
    if (error) {
      console.error('Error al guardar en la base de datos:', error);
      return { statusCode: 500, body: JSON.stringify({ message: 'Error al guardar en la base de datos.' }) };
    }

    // Configuración de Nodemailer
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
    return { statusCode: 500, body: JSON.stringify({ message: 'Error en el servidor.' }) };
  }
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