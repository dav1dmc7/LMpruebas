import nodemailer from 'nodemailer';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

export async function handler(event) {
    try {
        console.log('Inicio de la función serverless');
        const formData = new URLSearchParams(event.body);
        console.log('Datos del formulario procesados:', Object.fromEntries(formData.entries()));

        // Configuración de Supabase
        const supabaseUrl = 'https://jnkluabtktatvtsbfamn.supabase.co';
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Validar reCAPTCHA
        const recaptchaResponse = formData.get('g-recaptcha-response');
        const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;
        const recaptchaRes = await fetch(verificationUrl, { method: 'POST' });
        const recaptchaData = await recaptchaRes.json();

        if (!recaptchaData.success) {
            console.error('Fallo en reCAPTCHA:', recaptchaData['error-codes']);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Error en reCAPTCHA.' }),
            };
        }

        // Insertar datos en Supabase
        const { nombre, email, mensaje } = Object.fromEntries(formData.entries());
        console.log('Intentando insertar datos en Supabase:', { nombre, email, mensaje });

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
            service: 'gmail',
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
        console.log('Intentando enviar correo...');
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado correctamente.');

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
}
console.log('Variables de entorno:', {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL,
});
try {
    console.log('Intentando enviar correo...');
    console.log('Configuración de transporte:', {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado correctamente:', info.response);
} catch (error) {
    console.error('Error al enviar el correo:', error);
    throw new Error('Error al enviar el correo');
}
