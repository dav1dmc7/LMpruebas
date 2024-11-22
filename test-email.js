const nodemailer = require('nodemailer');

async function sendTestEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lopezmarquezabogados@gmail.com',
      pass: 'tu_contraseña_aquí', // Asegúrate de usar la contraseña correcta
    },
  });

  const mailOptions = {
    from: 'lopezmarquezabogados@gmail.com',
    to: 'lopezmarquezabogados@gmail.com', // Puedes usar la misma dirección para la prueba
    subject: 'Correo de Prueba',
    text: 'Este es un correo de prueba para verificar si Nodemailer funciona correctamente.',
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado correctamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
}

sendTestEmail();
