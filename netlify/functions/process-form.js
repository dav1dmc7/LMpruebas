const express = require('express');
const axios = require('axios');
const nodemailer = require('nodemailer');
const app = express();
require('dotenv').config();

// Middleware para parsear JSON
app.use(express.json());

// Endpoint para procesar formulario
app.post('/.netlify/functions/process-form', async (req, res) => {
    try {
        console.info('Método HTTP recibido:', req.method);
        console.info('Cuerpo recibido:', req.body);

        const { nombre, email, mensaje, 'g-recaptcha-response': recaptchaToken } = req.body;

        if (!recaptchaToken) {
            console.error('Token de reCAPTCHA ausente');
            return res.status(400).json({ error: 'Token de reCAPTCHA ausente' });
        }

        console.info('Verificando reCAPTCHA...');

        // Verificar token de reCAPTCHA
        const recaptchaResponse = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            {},
            {
                params: {
                    secret: process.env.RECAPTCHA_SECRET_KEY,
                    response: recaptchaToken,
                },
            }
        );

        console.info('Respuesta de reCAPTCHA:', recaptchaResponse.data);

        if (!recaptchaResponse.data.success) {
            throw new Error(
                'Verificación de reCAPTCHA fallida: ' + recaptchaResponse.data['error-codes']
            );
        }

        // Configuración del transporte de Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Opciones del correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `Nuevo mensaje de contacto de ${nombre}`,
            text: `Nombre: ${nombre}\nEmail: ${email}\nMensaje: ${mensaje}`,
        };

        // Enviar correo
        await transporter.sendMail(mailOptions);

        console.info('Correo enviado exitosamente.');
        res.status(200).json({ message: 'Formulario procesado correctamente' });
    } catch (error) {
        console.error('Error procesando el formulario:', error.message);
        res.status(500).json({ error: 'Error al procesar el formulario', details: error.message });
    }
});

// Escuchar en el puerto configurado
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.info(`Servidor ejecutándose en el puerto ${PORT}`);
});
