// scripts.js

// Función para toggle del menú principal
function toggleMenu() {
  const navLinks = document.querySelector('nav ul');
  navLinks.classList.toggle('show');
}

// Función para toggle del submenú en móvil
function toggleSubMenu(event) {
  event.preventDefault();
  const parent = this.parentElement;
  parent.classList.toggle('show-submenu');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Listener para el menú hamburguesa
  const menuIcon = document.querySelector('.menu-icon');
  if (menuIcon) {
    menuIcon.addEventListener('click', toggleMenu);
  }

  // Listener para los elementos del menú que tienen submenú
  const submenuParents = document.querySelectorAll('nav ul li a[href="servicios.html"]');
  submenuParents.forEach((parentLink) => {
    parentLink.addEventListener('click', toggleSubMenu);
  });

  // Resto de tu código...
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
      body: new URLSearchParams(formData), // Convertir FormData a URLSearchParams
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
  document.body.appendChild(mensajeExito);
  setTimeout(() => mensajeExito.remove(), 5000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Listener para el menú hamburguesa
  const menuIcon = document.querySelector('.menu-icon');
  if (menuIcon) {
    menuIcon.addEventListener('click', toggleMenu);
  }

  // Listener para las flechas del submenú
  const mobileArrows = document.querySelectorAll('.mobile-arrow');
  mobileArrows.forEach((arrow) => {
    arrow.addEventListener('click', toggleSubMenu);
  });

  // Listener para el formulario de contacto
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', enviarFormulario);
  }
});
