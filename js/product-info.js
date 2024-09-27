document.addEventListener("DOMContentLoaded", function() {
    //obtener el Identificador
    const productoId = localStorage.getItem("productoId");

    if (!productoId) {
        console.error("No se ha encontrado el ID del producto.");
        return;
    }

    //se construye una URL para realizar una solicitud a un API para obtener información sobre un producto específico
    const url = `${PRODUCT_INFO_URL}${productoId}.json`; // usa el ID del producto

    //realiza una solicitud HTTP para obtener datos en formato JSON desde la URL especificada.
    getJSONData(url).then(function(resultObj) {
        if (resultObj.status === "ok") {
            mostrarProducto(resultObj.data);
        } else {
            console.error("Error en la obtención de datos:", resultObj.data);
        }
    });

    //para obtener los comentarios del producto
    const urlComentarios = `https://japceibal.github.io/emercado-api/products_comments/${productoId}.json`;
    getJSONData(urlComentarios).then(function(resultObj) {
        if (resultObj.status === "ok") {
            console.log(resultObj.data); // Agrega este log para ver los datos en la consola
            mostrarCalificaciones(resultObj.data);
        } else {
            console.error("Error en la obtención de comentarios:", resultObj.data);
        }
    });

    // Agregar evento de aplicar filtros
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
});

function mostrarProducto(producto) {
    // genera HTML para cada imagen en el array, con la estructura de Bootstrap para el carrusel
    //con controles para navegar entre las imágenes y asegurar que el diseño sea limpio y responsivo
    let imagesHtml = producto.images.map((img, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${img}" class="d-block w-100" alt="${producto.name}">
        </div>
    `).join('');

    let htmlContentToAppend = `
    <div class="col-12">
        <div id="productCarousel" class="carousel slide shadow-lg rounded">
            <div class="carousel-inner">
                ${imagesHtml}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
        <div class="custom-card-body">
            <hr style="border: 3px solid #ff8a0d; width: 100%; margin: 0;">
            <h5 class="card-title text-center fw-bold fs-1">${producto.name}</h5>
            <hr style="border: 3px solid #ff8a0d; width: 100%; margin: 0 auto 20px auto;">
            <p class="card-text" style="font-size: 1.5rem;">${producto.description}</p>
            <p class="card-text" style="font-size: 1.1rem;"><strong>Categoria:</strong> ${producto.category}</p>
            <p class="card-text" style="font-size: 1.1rem;"><strong>Vendidos:</strong> ${producto.soldCount}</p>
            <p class="card-text text-danger" style="font-size: 1.1rem;"><strong>Precio:</strong> ${producto.currency} ${producto.cost}</p>
        </div>
    </div>
    `;
    document.getElementById("product-info").innerHTML = htmlContentToAppend;
}

// Función para mostrar las calificaciones (comentarios) como cards
function mostrarCalificaciones(comentarios) {
    let calificacionesHtml = ''; // Iniciar como cadena vacía
    comentarios.forEach(comentario => {
        calificacionesHtml += `
            <div class="card mb-4 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title" style="color: #ff8a0d; font-weight: bold;">${comentario.user}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${comentario.dateTime}</h6>
                    <p class="card-text"><strong>Comentario:</strong> ${comentario.description}</p>
                    <p class="card-text"><strong>Producto ID:</strong> ${comentario.product}</p>
                    <p class="card-text"><strong>Puntuación:</strong> ${comentario.score}</p>
                </div>
            </div>
        `;
    });

    document.getElementById("calificaciones-lista").innerHTML = calificacionesHtml;
}

