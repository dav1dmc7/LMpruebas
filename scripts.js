// Menú hamburguesa para dispositivos móviles
function toggleMenu() {
  const navLinks = document.getElementById('nav-links');
  if (navLinks) {
    navLinks.classList.toggle('show');
    document.body.classList.toggle('no-scroll'); // Evita el desplazamiento de fondo cuando el menú está abierto
  }
}

// Función para controlar el submenú de servicios en móvil
function setupSubmenuToggle() {
  const submenuToggles = document.querySelectorAll('.submenu-toggle');
  submenuToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const parent = toggle.parentElement;
      if (parent.classList.contains('submenu-parent')) {
        parent.classList.toggle('show-submenu');
        const submenu = parent.querySelector('.submenu');
        if (submenu) {
          submenu.classList.toggle('submenu-show'); // Asegura que el submenú se muestre al hacer clic
        }
      }
    });
  });
}

// Función para manejar las preguntas frecuentes
function setupFaqToggle() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach((button) => {
    button.addEventListener('click', () => {
      const answer = button.nextElementSibling;
      const icon = button.querySelector('i');
      if (answer) {
        answer.classList.toggle('open');
      }
      if (icon) {
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
      }
    });
  });
}

// Llamar a las funciones cuando la página cargue
document.addEventListener('DOMContentLoaded', function () {
  setupSubmenuToggle();

  // Listener para el menú hamburguesa
  const menuIcon = document.querySelector('.menu-icon');
  if (menuIcon) {
    menuIcon.addEventListener('click', toggleMenu);
  }

  // Listener para el formulario de contacto
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Evitar el envío tradicional del formulario

      // Capturar los datos del formulario
      const formData = new FormData(form);
      const data = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        mensaje: formData.get('mensaje'),
      };

      // Llamar a la función para manejar los datos (guardar en Supabase y enviar correo)
      await submitContactForm(data);
    });
  }

  setupFaqToggle();
});

// Inicializar el cliente de Supabase
const supabaseUrl = 'https://jnkluabtktatvtsbfamn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impua2x1YWJ0a3RhdHZ0c2JmYW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxNTMzNTEsImV4cCI6MjA0NTcyOTM1MX0.DKGFbfq3z6-vxrg23SenSXbtBg2f4hZGvIO36ogofGY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Función para validar y enviar el formulario de contacto
async function submitContactForm(data) {
  try {
    // Guardar los datos en la base de datos de Supabase
    const { data: insertedData, error } = await supabase
      .from('clientes') // Asegúrate de que este sea el nombre correcto de la tabla en Supabase
      .insert([data]);

    if (error) {
      console.error('Error al guardar en Supabase:', error.message);
      throw new Error('Error al guardar en la base de datos');
    }

    // Enviar el correo de notificación al administrador
    const response = await fetch('/.netlify/functions/process-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error('Error al enviar el correo:', await response.text());
      throw new Error('Error al enviar el correo electrónico.');
    }

    // Mensaje de éxito
    mostrarMensajeExito('¡Formulario enviado y datos guardados correctamente! Pronto nos pondremos en contacto contigo.');
    document.getElementById('contact-form').reset(); // Limpiar el formulario después de enviar
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    mostrarAlerta('Error al procesar el formulario. Por favor, intenta más tarde.');
  }
}

// Función para mostrar mensaje de éxito
function mostrarMensajeExito(mensaje) {
  const mensajeExito = document.createElement('div');
  mensajeExito.className = 'mensaje-exito';
  mensajeExito.textContent = mensaje;
  document.querySelector('main').appendChild(mensajeExito);
  setTimeout(() => mensajeExito.remove(), 5000);
}

// Función para mostrar alertas personalizadas
function mostrarAlerta(mensaje) {
  const alerta = document.createElement('div');
  alerta.className = 'alerta';
  alerta.textContent = mensaje;
  document.querySelector('main').appendChild(alerta);
  setTimeout(() => alerta.remove(), 5000);
}

// Función para validar y enviar el formulario de contacto
async function submitContactForm(data) {
  try {
    // Guardar los datos en la base de datos de Supabase
    const { data: insertedData, error } = await supabase
      .from('clientes') // Asegúrate de que este sea el nombre correcto de la tabla en Supabase
      .insert([data]);

    if (error) {
      console.error('Error al guardar en Supabase:', error.message);
      throw new Error('Error al guardar en la base de datos');
    }

    // Enviar el correo de notificación al administrador
    const response = await fetch('/.netlify/functions/process-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Respuesta del correo:', response); // Agrega esta línea para ver la respuesta
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error al enviar el correo:', errorText);
      throw new Error('Error al enviar el correo electrónico.');
    }

    // Mensaje de éxito
    mostrarMensajeExito('¡Formulario enviado y datos guardados correctamente! Pronto nos pondremos en contacto contigo.');
    document.getElementById('contact-form').reset(); // Limpiar el formulario después de enviar
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    mostrarAlerta('Error al procesar el formulario. Por favor, intenta más tarde.');
  }
}
