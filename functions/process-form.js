import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

export async function handler(event) {
    try {
        console.log('Inicio de la función serverless');
        
        // Configuración de Supabase
        const supabaseUrl = 'https://jnkluabtktatvtsbfamn.supabase.co';
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Extraer datos del formulario
        const formData = JSON.parse(event.body);
        console.log('Datos del formulario:', formData);

        // Validar reCAPTCHA
        const recaptchaResponse = formData['g-recaptcha-response'];
        const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;
        const recaptchaRes = await fetch(verificationUrl, { method: 'POST' });
        const recaptchaData = await recaptchaRes.json();
        console.log('Respuesta de reCAPTCHA:', recaptchaData);

        if (!recaptchaData.success) {
            console.error('Fallo en reCAPTCHA:', recaptchaData['error-codes']);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Error en reCAPTCHA.' }),
            };
        }

        // Insertar datos en Supabase
        const { nombre, email, mensaje } = formData;
        console.log('Intentando insertar datos en Supabase:', { nombre, email, mensaje });

        const { data, error } = await supabase.from('clientes').insert([{ nombre, email, mensaje }]);
        if (error) {
            console.error('Error al guardar en la base de datos:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error al guardar en la base de datos.' }),
            };
        }

        console.log('Datos insertados correctamente en Supabase:', data);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Formulario enviado correctamente.' }),
        };
    } catch (error) {
        console.error('Error inesperado en la función serverless:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error en el servidor.' }),
        };
    }
}
