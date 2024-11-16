import nodemailer from 'nodemailer';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

export async function handler(event) {
    try {
        console.log('Inicio de la función serverless');

        // Parsear datos del formulario
        const formData = new URLSearchParams(event.body);
        const { nombre, email, mensaje } = Object.fromEntries(formData.entries());
        console.log('Datos del formulario procesados:', { nombre, email, mensaje });

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

        // Verificar si el correo ya existe en Supabase
        const { data: existingClient, error: selectError } = await supabase
            .from('clientes')
            .select('*')
            .eq('email', email);

        if (existingClient && existingClient.length > 0) {
            console.log('Correo ya existente:', email);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Este correo ya existe.' }),
            };
        }

        // Insertar datos en Supabase
        const { error: insertError } = await supabase
            .from('clientes')
            .insert([{ nombre, email, mensaje }]);

        if (insertError) {
            console.error('Error al guardar en la base de datos:', insertError);
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
        try {
            await transporter.sendMail(mailOptions);
            console.log('Correo enviado correctamente.');
        } catch (mailError) {
            console.error('Error al enviar el correo:', mailError);
        }

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
