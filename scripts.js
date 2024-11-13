// scripts.js

// Configuración de Supabase
const supabaseUrl = 'https://jnkluabtktatvtsbfamn.supabase.co';
const supabaseKey = 'TU_SUPABASE_ANON_KEY'; // Reemplaza con tu clave pública
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Calificación y Envío de Reseñas a Supabase
let calificacionSeleccionada = 0;

async function enviarReseña(event) {
  event.preventDefault();

  const comentario = document.getElementById('comentario').value;

  if (calificacionSeleccionada > 0 && comentario) {
    const { data, error } = await supabase
      .from('reseñas')
      .insert([{ calificacion: calificacionSeleccionada, comentario }]);

    if (error) {
      console.error('Error al enviar la reseña:', error);
    } else {
      mostrarReseñas();
      document.getElementById('comentario').value = '';
      calificar(0); // Reinicia la calificación
    }
  } else {
    alert('Por favor, selecciona una calificación y escribe un comentario.');
  }
}

// Mostrar Reseñas desde Supabase
async function mostrarReseñas() {
  const { data: reseñas, error } = await supabase
    .from('reseñas')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error('Error al cargar las reseñas:', error);
  } else {
    const lista = document.getElementById('lista-reseñas');
    lista.innerHTML = '';
    reseñas.forEach((reseña) => {
      const item = document.createElement('li');
      item.innerHTML = `<strong>Calificación:</strong> ${reseña.calificacion} estrellas<br><strong>Comentario:</strong> ${reseña.comentario}`;
      lista.appendChild(item);
    });
  }
}

// Función para calificar con estrellas
function calificar(puntaje) {
  calificacionSeleccionada = puntaje;
  const estrellas = document.querySelectorAll('.estrella');
  estrellas.forEach((estrella, index) => {
    if (index >= 5 - puntaje) {
      estrella.classList.add('seleccionada');
    } else {
      estrella.classList.remove('seleccionada');
    }
  });
}

// Validación del formulario de contacto
function validarFormulario() {
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  // Validar campos vacíos
  if (nombre === '' || email === '' || mensaje === '') {
    alert('Por favor, completa todos los campos del formulario.');
    return false;
  }

  // Validar formato del email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Por favor, ingresa un correo electrónico válido.');
    return false;
  }

  // Validar longitud mínima del mensaje
  if (mensaje.length < 10) {
    alert('El mensaje debe tener al menos 10 caracteres.');
    return false;
  }

  return true;
}

// Función para controlar el menú hamburguesa
function toggleMenu() {
  const navLinks = document.getElementById('nav-links');
  navLinks.classList.toggle('show');
}

// Controlar el submenú en dispositivos móviles
function setupSubmenuToggle() {
  const submenuParents = document.querySelectorAll('.submenu-parent');
  submenuParents.forEach(function (submenuParent) {
    const submenuLink = submenuParent.querySelector('a');
    submenuLink.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const submenu = submenuParent.querySelector('.submenu');
        submenu.classList.toggle('show-submenu');
      }
    });
  });
}

// Llamar a las funciones al cargar la página
document.addEventListener('DOMContentLoaded', function () {
  mostrarReseñas();
  setupSubmenuToggle();
});

// Función para mostrar el mensaje de éxito
function mostrarMensajeExito(mensaje) {
  const mensajeExito = document.createElement('div');
  mensajeExito.classList.add('mensaje-exito');
  mensajeExito.textContent = mensaje;
  document.querySelector('main').prepend(mensajeExito);

  // Ocultar el mensaje después de unos segundos (opcional)
  setTimeout(() => {
    mensajeExito.remove();
  }, 5000);
}

// Función para manejar el envío del formulario de contacto
async function enviarFormulario(event) {
  event.preventDefault();

  if (!validarFormulario()) return;

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Enviar los datos a la función serverless
  const response = await fetch(form.action, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (response.ok) {
    mostrarMensajeExito(result.message);
    form.reset();
  } else {
    alert('Error al enviar el formulario: ' + result.message);
  }
}

// Agregar el event listener al formulario
document.getElementById('contact-form').addEventListener('submit', enviarFormulario);
