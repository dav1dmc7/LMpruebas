// scripts.js

// Menú hamburguesa para dispositivos móviles
function toggleMenu() {
  const navLinks = document.getElementById('nav-links');
  if (navLinks) {
    navLinks.classList.toggle('show');
  }
}

// Función para controlar el submenú de servicios en móvil
function setupSubmenuToggle() {
  const submenuParents = document.querySelectorAll('.submenu-parent');
  submenuParents.forEach(function (submenuParent) {
    const submenuLink = submenuParent.querySelector('a');
    submenuLink.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const submenu = submenuParent.querySelector('.submenu');
        if (submenu) {
          submenu.classList.toggle('show-submenu');
        }
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
});


  // Listener para el formulario de contacto
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', enviarFormulario);
  }
});

// Función para validar el formulario de contacto
function validarFormulario() {
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  if (!nombre || !email || !mensaje) {
    alert('Por favor, completa todos los campos.');
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Por favor, ingresa un correo electrónico válido.');
    return false;
  }

  if (mensaje.length < 10) {
    alert('El mensaje debe tener al menos 10 caracteres.');
    return false;
  }

  return true;
}

// Función para enviar el formulario de contacto
async function enviarFormulario(event) {
  event.preventDefault();
  if (!validarFormulario()) return;

  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new URLSearchParams(formData),
    });

    const result = await response.json();
    if (response.ok) {
      mostrarMensajeExito(result.message);
      form.reset();
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    alert('Error al enviar el formulario: ' + error.message);
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
