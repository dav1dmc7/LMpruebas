// functions/process-form.js

import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

export const handler = async (event, context) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const supabaseUrl = 'https://jnkluabtktatvtsbfamn.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const formData = JSON.parse(event.body);

  // Verificar reCAPTCHA
  const recaptchaResponse = formData['g-recaptcha-response'];
  
  if (!recaptchaResponse) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Falta la respuesta de reCAPTCHA.' }),
    };
  }

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

  try {
    const recaptchaRes = await fetch(verificationUrl, { method: 'POST' });
    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Error en reCAPTCHA.' }),
      };
    }

    // Procesar el formulario (por ejemplo, guardar en Supabase)
    const { nombre, email, mensaje } = formData;

    const { data, error } = await supabase
      .from('contactos')
      .insert([{ nombre, email, mensaje }]);

    if (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error al guardar en la base de datos.' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Formulario enviado correctamente.' }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al procesar la solicitud.' }),
    };
  }
};
