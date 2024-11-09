// Configuración de Supabase
const supabaseUrl = 'https://jnkluabtktatvtsbfamn.supabase.co';
const supabaseKey = 'TU_SUPABASE_KEY'; // Asegúrate de mantener segura tu clave
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
        reseñas.forEach(reseña => {
            const item = document.createElement('li');
            item.innerHTML = `<strong>Calificación:</strong> ${reseña.calificacion} estrellas<br><strong>Comentario:</strong> ${reseña.comentario}`;
            lista.appendChild(item);
        });
    }
}

// Llama a mostrarReseñas al cargar la página
document.addEventListener('DOMContentLoaded', mostrarReseñas);

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

// Función para controlar el menú hamburguesa
function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('show');
}

// Validación del formulario de contacto
function validarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (nombre === '' || email === '' || mensaje === '') {
        alert('Por favor, completa todos los campos del formulario.');
        return false;
    }

    // Puedes añadir más validaciones aquí (por ejemplo, formato del email)

    return true;
}
