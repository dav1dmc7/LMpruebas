// Configuración de Supabase
const supabaseUrl = 'https://jnkluabtktatvtsbfamn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impua2x1YWJ0a3RhdHZ0c2JmYW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxNTMzNTEsImV4cCI6MjA0NTcyOTM1MX0.DKGFbfq3z6-vxrg23SenSXbtBg2f4hZGvIO36ogofGY';
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
        if (index < puntaje) {
            estrella.classList.add('seleccionada');
        } else {
            estrella.classList.remove('seleccionada');
        }
    });
}

function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('show');
}

