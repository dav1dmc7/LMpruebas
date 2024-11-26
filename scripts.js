// Inicializar el cliente de Supabase
const supabaseUrl = 'https://jnkluabtktatvtsbfamn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impua2x1YWJ0a3RhdHZ0c2JmYW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxNTMzNTEsImV4cCI6MjA0NTcyOTM1MX0.DKGFbfq3z6-vxrg23SenSXbtBg2f4hZGvIO36ogofGY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Menú hamburguesa para dispositivos móviles
function toggleMenu() {
  console.log("Menú hamburguesa activado");
  const navLinks = document.getElementById('nav-links');
  if (navLinks) {
      navLinks.classList.toggle('show');
      document.body.classList.toggle('no-scroll');
      console.log("Menú hamburguesa activado");

  }
}

// Configuración del submenú para móvil
function setupSubmenuToggle() {
  const submenuToggles = document.querySelectorAll('.submenu-toggle');
  submenuToggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = toggle.parentElement;
      const submenu = parent.querySelector('.submenu');

      // Cierra otros submenús
      document.querySelectorAll('.submenu-parent').forEach((item) => {
        if (item !== parent) {
          item.classList.remove('show-submenu');
          const otherSubmenu = item.querySelector('.submenu');
          if (otherSubmenu) {
            otherSubmenu.classList.remove('submenu-show');
          }
        }
      });

      // Alterna el submenú actual
      parent.classList.toggle('show-submenu');
      if (submenu) submenu.classList.toggle('submenu-show');
    });
  });
}

// Configuración de las preguntas frecuentes
function setupFaqToggle() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach((button) => {
    button.addEventListener('click', () => {
      const answer = button.nextElementSibling;
      const icon = button.querySelector('i');

      // Alternar visibilidad
      answer?.classList.toggle('open');
      icon?.classList.toggle('fa-chevron-down');
      icon?.classList.toggle('fa-chevron-up');
    });
  });
}

// Función principal para el envío del formulario
async function submitContactForm(data) {
  try {
    // Insertar datos en Supabase
    const { error } = await supabase.from('clientes').insert([data]);

    if (error) throw new Error(`Supabase error: ${error.message}`);

    // Enviar correo al administrador
    const response = await fetch('/.netlify/functions/process-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Error en correo: ${await response.text()}`);

    // Mostrar mensaje de éxito
    mostrarMensajeExito('¡Formulario enviado correctamente!');
    document.getElementById('contact-form').reset();
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    mostrarAlerta('Error al procesar el formulario. Intenta nuevamente.');
  }
}

// Mostrar alertas personalizadas
function mostrarAlerta(mensaje) {
  const alerta = document.createElement('div');
  alerta.className = 'alerta';
  alerta.textContent = mensaje;
  document.querySelector('main').appendChild(alerta);
  setTimeout(() => alerta.remove(), 5000);
}

// Mostrar mensaje de éxito
function mostrarMensajeExito(mensaje) {
  const mensajeExito = document.createElement('div');
  mensajeExito.className = 'mensaje-exito';
  mensajeExito.textContent = mensaje;
  document.querySelector('main').appendChild(mensajeExito);
  setTimeout(() => mensajeExito.remove(), 5000);
}

// Inicializar las funciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  setupSubmenuToggle();
  setupFaqToggle();

  const menuIcon = document.querySelector('.menu-icon');
  menuIcon?.addEventListener('click', toggleMenu);

  const form = document.querySelector('#contact-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const recaptchaResponse = grecaptcha.getResponse();

    if (!recaptchaResponse) {
      mostrarAlerta('Por favor, verifica que no eres un robot.');
      return;
    }

    const data = {
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      mensaje: formData.get('mensaje'),
      'g-recaptcha-response': recaptchaResponse,
    };

    await submitContactForm(data);
  });
});
