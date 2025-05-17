
const API_URL = 'http://localhost:3000/api/productos';

function insertarProducto() {
    const nombre = document.getElementById('nombre').value;
    const stock = document.getElementById('stock').value;

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, stock })
    })
        .then(res => res.json())
        .then(data => {
            alert("Producto insertado");
            obtenerProductos();
        });
}

function obtenerProductos() {
    fetch(API_URL)
        .then(res => res.json())
        .then(productos => {
            const lista = document.getElementById('lista');
            lista.innerHTML = '';
            productos.forEach(p => {
                const item = document.createElement('li');
                item.innerHTML = `${p.id}: ${p.nombre} (Stock: ${p.stock}) 
                            <button onclick="eliminarProducto(${p.id})">Eliminar</button>`;
                lista.appendChild(item);
            });
        });
}

function eliminarProducto(id) {
    fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(() => {
            alert("Producto eliminado");
            obtenerProductos();
        });
}

// Opcional: obtener productos al cargar
obtenerProductos();