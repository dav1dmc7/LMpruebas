// Función para navegar entre reseñas
let reseñaActual = 1;

function siguienteReseña() {
    document.getElementById(`reseña${reseñaActual}`).style.display = "none";
    reseñaActual = reseñaActual === 3 ? 1 : reseñaActual + 1;
    document.getElementById(`reseña${reseñaActual}`).style.display = "block";
}

// Función para mostrar/ocultar detalles de los servicios
function toggleDetalles(id) {
    const detalles = document.getElementById(id);
    detalles.style.display = detalles.style.display === "none" ? "block" : "none";
}


function toggleDetalles(id) {
    const detalles = document.getElementById(id);
    detalles.style.display = detalles.style.display === "none" ? "block" : "none";
}
