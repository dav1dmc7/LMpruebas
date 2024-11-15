const { createClient } = require('@supabase/supabase-js');

// Importación dinámica de `node-fetch` ya que la versión 3 requiere ESM
let fetch;

export async function handler(event, context) {
  // Importación de `node-fetch` solo cuando se usa la función
  if (!fetch) {
    fetch = (await import('node-fetch')).default;
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const supabaseUrl = 'https://jnkluabtktatvtsbfamn.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const formData = JSON.parse(event.body);

  // Verificar reCAPTCHA
  const recaptchaResponse = formData['g-recaptcha-response'];
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

  try {
    const recaptchaRes = await fetch(verificationUrl, { method: 'POST' });
    const recaptchaData = await recaptchaRes.json();

    if (recaptchaData.success) {
      // Procesar el formulario (por ejemplo, guardar en Supabase)
      const { nombre, email, mensaje } = formData;

      // Inserta los datos en Supabase
      const { data, error } = await supabase
        .from('contactos')
        .insert([{ nombre, email, mensaje }]);

      if (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Error al guardar en la base de datos.' }),
        };
      }

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
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error en el servidor.', error: error.message }),
    };
  }
}
