// Inicializar el cliente de Supabase
const supabaseUrl = 'https://jnkluabtktatvtsbfamn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impua2x1YWJ0a3RhdHZ0c2JmYW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxNTMzNTEsImV4cCI6MjA0NTcyOTM1MX0.DKGFbfq3z6-vxrg23SenSXbtBg2f4hZGvIO36ogofGY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Menú hamburguesa para dispositivos móviles
function toggleMenu() {
  const navLinks = document.getElementById('nav-links');
  if (navLinks) {
    const isExpanded = navLinks.classList.toggle('show');
    document.body.classList.toggle('no-scroll'); // Evitar el desplazamiento cuando el menú esté abierto
    navLinks.setAttribute('aria-expanded', isExpanded);
  }
}

// Configuración del submenú para móvil
function setupSubmenuToggle() {
  const submenuToggles = document.querySelectorAll('.submenu-toggle');
  submenuToggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = toggle.parentElement;
      parent.classList.toggle('show-submenu');
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

// Mostrar reseñas de Google en el footer
async function mostrarResenasGoogle() {
  const placeId = 'g/11y8v_vngh';
  const apiKey = 'AIzaSyAWTIBof7-BrQIwPLM5MYqlZy1aflOsHZc';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error('No se pudieron obtener las reseñas de Google');
    }

    const reseñas = data.result.reviews;
    const reseñasContainer = document.querySelector('.google-reviews-container');

    if (reseñas && reseñas.length > 0) {
      reseñas.forEach((resena) => {
        const reseñaElemento = document.createElement('div');
        reseñaElemento.classList.add('google-review');
        reseñaElemento.innerHTML = `
          <p class="google-review-author">${resena.author_name}</p>
          <p class="google-review-text">${resena.text}</p>
        `;
        reseñasContainer.appendChild(reseñaElemento);
      });
    } else {
      reseñasContainer.innerHTML = `<p>No hay reseñas disponibles en este momento.</p>`;
    }
  } catch (error) {
    console.error('Error al obtener reseñas de Google:', error);
  }
}

// Inicializar las funciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  setupSubmenuToggle();
  setupFaqToggle();
  mostrarResenasGoogle();

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

  const estrellas = document.querySelectorAll('.estrella');
  let calificacionSeleccionada = 0;

  estrellas.forEach((estrella, index) => {
    estrella.addEventListener('mouseover', () => {
      estrellas.forEach((e, i) => {
        e.style.color = i <= index ? '#f4c842' : '#c3c3c3';
      });
    });

    estrella.addEventListener('mouseout', () => {
      estrellas.forEach((e, i) => {
        e.style.color = i < calificacionSeleccionada ? '#f4c842' : '#c3c3c3';
      });
    });

    estrella.addEventListener('click', () => {
      calificacionSeleccionada = index + 1;
      estrellas.forEach((e, i) => {
        e.style.color = i < calificacionSeleccionada ? '#f4c842' : '#c3c3c3';
      });

      window.open('https://g.page/lopez-marquez-abogados/review?gm', '_blank');
    });
  });
});
