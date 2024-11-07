let calificacionSeleccionada = 0;

// Función para calificar con estrellas
function calificar(puntaje) {
    calificacionSeleccionada = puntaje;
    const estrellas = document.querySelectorAll('.estrella');
    estrellas.forEach((estrella, index) => {
        estrella.style.color = index < puntaje ? 'gold' : 'white';
    });
}

// Función para mostrar la reseña temporalmente en la lista de reseñas
function mostrarReseña(event) {
    event.preventDefault();
    
    // Obtiene el comentario del formulario
    const comentario = document.getElementById('comentario').value;

    // Crea un nuevo elemento de reseña
    const nuevaReseña = document.createElement('li');
    nuevaReseña.innerHTML = `<strong>Calificación:</strong> ${calificacionSeleccionada} estrellas<br><strong>Comentario:</strong> ${comentario}`;
    
    // Agrega la reseña a la lista de reseñas
    document.getElementById('lista-reseñas').appendChild(nuevaReseña);

    // Limpia el formulario y las estrellas
    document.getElementById('comentario').value = '';
    calificar(0);
}


function toggleDetalles(id) {
    const detalles = document.getElementById(id);
    detalles.style.display = detalles.style.display === "none" ? "block" : "none";
}
