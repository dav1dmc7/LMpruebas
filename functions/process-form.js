import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

export async function handler(event) {
    try {
        const supabaseUrl = 'https://jnkluabtktatvtsbfamn.supabase.co';
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const formData = JSON.parse(event.body);
        console.log('Datos del formulario:', formData);

        const recaptchaResponse = formData['g-recaptcha-response'];
        const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;
        const recaptchaRes = await fetch(verificationUrl, { method: 'POST' });
        const recaptchaData = await recaptchaRes.json();
        console.log('Respuesta de reCAPTCHA:', recaptchaData);

        if (!recaptchaData.success) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Error en reCAPTCHA.' }),
            };
        }

        const { nombre, email, mensaje } = formData;
        const { error } = await supabase
            .from('clientes')
            .insert([{ nombre, email, mensaje }]);

        if (error) {
            console.error('Error al guardar en la base de datos:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error al guardar en la base de datos.' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Formulario enviado correctamente.' }),
        };
    } catch (error) {
        console.error('Error en la función serverless:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error en el servidor.' }),
        };
    }
}
