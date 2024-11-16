// Configuración de Supabase
const supabaseUrl = 'https://jnkluabtktatvtsbfamn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impua2x1YWJ0a3RhdHZ0c2JmYW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxNTMzNTEsImV4cCI6MjA0NTcyOTM1MX0.DKGFbfq3z6-vxrg23SenSXbtBg2f4hZGvIO36ogofGY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

let calificacionSeleccionada = 0;

// Función para toggle del menú principal
function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('show');
  }
  
  // Función para toggle del submenú
  function toggleSubMenu(event) {
    event.preventDefault();
    const submenu = this.parentElement.querySelector('.submenu');
    submenu.classList.toggle('show-submenu');
  }
  
  // Listeners
  document.addEventListener('DOMContentLoaded', () => {
    // Listener para el menú hamburguesa
    const menuIcon = document.querySelector('.menu-icon');
    if (menuIcon) {
      menuIcon.addEventListener('click', toggleMenu);
    }
  
    // Listener para la flecha en "Servicios"
    const mobileArrow = document.querySelector('.mobile-arrow');
    if (mobileArrow) {
      mobileArrow.addEventListener('click', toggleSubMenu);
    }
  });  

// Enviar Reseña
async function enviarReseña(event) {
    event.preventDefault();

    const comentario = document.getElementById('comentario').value;
    if (calificacionSeleccionada > 0 && comentario) {
        try {
            const { error } = await supabase
                .from('reseñas')
                .insert([{ calificacion: calificacionSeleccionada, comentario }]);

            if (error) throw error;

            mostrarReseñas();
            document.getElementById('comentario').value = '';
            calificar(0); // Reinicia la calificación
        } catch (error) {
            console.error('Error al enviar la reseña:', error);
        }
    } else {
        alert('Por favor, selecciona una calificación y escribe un comentario.');
    }
}

// Mostrar Reseñas
async function mostrarReseñas() {
    try {
        const { data: reseñas, error } = await supabase
            .from('reseñas')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        const lista = document.getElementById('lista-reseñas');
        lista.innerHTML = '';
        reseñas.forEach((reseña) => {
            const item = document.createElement('li');
            item.innerHTML = `<strong>Calificación:</strong> ${reseña.calificacion} estrellas<br><strong>Comentario:</strong> ${reseña.comentario}`;
            lista.appendChild(item);
        });
    } catch (error) {
        console.error('Error al cargar las reseñas:', error);
    }
}

// Calificar con estrellas
function calificar(puntaje) {
    calificacionSeleccionada = puntaje;
    document.querySelectorAll('.estrella').forEach((estrella, index) => {
        estrella.classList.toggle('seleccionada', index >= 5 - puntaje);
    });
}

// Validar Formulario de Contacto
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
        alert('Por favor, ingresa un correo válido.');
        return false;
    }

    if (mensaje.length < 10) {
        alert('El mensaje debe tener al menos 10 caracteres.');
        return false;
    }

    return true;
}

// Enviar Formulario de Contacto
async function enviarFormulario(event) {
    event.preventDefault();
    if (!validarFormulario()) return;

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: new URLSearchParams(data),
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

// Mostrar Mensaje de Éxito
function mostrarMensajeExito(mensaje) {
    const mensajeExito = document.createElement('div');
    mensajeExito.className = 'mensaje-exito';
    mensajeExito.textContent = mensaje;
    document.body.appendChild(mensajeExito);
    setTimeout(() => mensajeExito.remove(), 5000);
}

// Listeners
document.addEventListener('DOMContentLoaded', () => {
    mostrarReseñas();
    document.getElementById('contact-form').addEventListener('submit', enviarFormulario);
});
