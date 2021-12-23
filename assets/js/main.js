
/** APLICACIÓN DE CLASE 16 **/


let productos = [];




/*
    CLASE E INSTANCIA DE CARRITO
*/

class Carrito {
    productos = [];

    constructor(){}

    agregarProducto( producto ){
        this.productos.push( producto );
        localStorage.setItem('carrito', JSON.stringify(this.productos));
    }

    quitarProducto( productoId ){
        this.productos = this.productos.filter( item => item.id !== productoId );
        localStorage.setItem('carrito', JSON.stringify(this.productos));
    }

    obtenerTotal(){
        const total = this.productos.reduce( (acumulador, item) => (item.precio_descuento > 0)? acumulador + item.precio_descuento: acumulador + item.precio, 0 );

        return total;
    }

    obtenerCantidadProductos(){
        return this.productos.length;
    }

}

const miCarrito = new Carrito();



/*
    FUNCIONES
*/

function agregarProducto( productoId ){
    const productoEnCarrito = miCarrito.productos.find( item => item.id == productoId );

    if(!productoEnCarrito){
        const producto = productos.find( item => item.id == productoId);
        miCarrito.agregarProducto(producto);

        const item = document.createElement("div");
        item.innerHTML = `
        <div id="carrito-producto-${productoId}" class="carrito-producto">
            <div style="display: flex; align-items: center">
                <div class="producto-action">
                    <button type="button" class="btn-quitar-producto" onclick="quitarProducto(${ producto.id })" alt="Quitar producto">X</button>
                </div>
                <div class="producto-info">
                    <p class="producto__nombre">${producto.nombre}</p>
                    <p class="producto__descripcion">${producto.descripcion}</p>
                </div>
            </div>
            <div class="producto__precio-wrapper">
                <span class="producto__precio">$${(producto.precio_descuento > 0)? producto.precio_descuento: producto.precio}</span>
            </div>
        </div>
        `;

        const carritoProductos = document.getElementById("carrito-productos");
        carritoProductos.appendChild(item);

        const totalCarrito = document.getElementById("totalCarrito");
        totalCarrito.value = '$' + miCarrito.obtenerTotal().toString();

        if(miCarrito.productos.length == 1){
            const mensajeCarritoVacio = document.getElementById('mensaje-carrito-vacio');
            mensajeCarritoVacio.parentNode.removeChild(mensajeCarritoVacio);
            mostrarFormularioCarrito();
        }
    } else{
        // mostrarNotificacion('El producto ya está en el carrito', 2000, 'warning');
        Swal.fire({
            icon: 'info',
            title: 'Ups ...',
            text: 'El producto ya está en el carrito',
            timer: 4000
        });
    }
    
}

function alertVaciarCarrito(){
    Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro de vaciar el carrito?',
        confirmButtonText: 'Si',
        showCancelButton: true
    }).then( resultado => {
        if(resultado.isConfirmed) this.vaciarCarrito();
    });
}

function vaciarCarrito(){
    for (const producto of miCarrito.productos) {
        quitarProducto(producto.id);
    }
}


function limpiarFormularioCarrito(){
    const nombre = document.getElementById('form-nombre');
    const direccion = document.getElementById('form-direccion');
    nombre.value = '';
    direccion.value = '';
    localStorage.clear();
}


function mostrarFormularioCarrito(){
    $("#formulario-carrito").toggle("fast");
}


function ocultarFormularioCarrito(){
    $("#formulario-carrito").toggle("fast");
}


function quitarProducto( productoId ){
    miCarrito.quitarProducto(productoId);
    const item = document.getElementById(`carrito-producto-${productoId}`);
    item.parentNode.removeChild(item);

    if(miCarrito.productos.length == 0){
        const mensaje = document.createElement("div");
        mensaje.innerHTML = `<p id="mensaje-carrito-vacio" class="mensaje-carrito-vacio">🛒 El carrito está vacio</p>`;

        const carritoProductos = document.getElementById("carrito-productos");
        carritoProductos.appendChild(mensaje);
        ocultarFormularioCarrito();
    }

    const totalCarrito = document.getElementById("totalCarrito");
    totalCarrito.value = '$' + miCarrito.obtenerTotal().toString();
}


function validarCampoNombre(){
    const nombre = document.getElementById('form-nombre');
    const invalidFeedbackNombre = document.getElementById('feedback-form-nombre');
    
    if(nombre.value == '' || !nombre.value){
        invalidFeedbackNombre.classList.add('show');
    } else{
        invalidFeedbackNombre.classList.remove('show');
    }
}


function validarCampoDireccion(){
    const direccion = document.getElementById('form-direccion');
    const invalidFeedbackDireccion = document.getElementById('feedback-form-direccion');

    if(direccion.value == '' || !direccion.value){
        invalidFeedbackDireccion.classList.add('show');
    } else{
        invalidFeedbackDireccion.classList.remove('show');
    }
}

function alertRealizarCompra(e){
    e.preventDefault();
    
    // se valida que los campos del formulario no estén vacios

    const nombre = document.getElementById('form-nombre');
    const direccion = document.getElementById('form-direccion');

    const invalidFeedbackNombre = document.getElementById('feedback-form-nombre');
    const invalidFeedbackDireccion = document.getElementById('feedback-form-direccion');

    if(nombre.value == '' || !nombre.value){
        invalidFeedbackNombre.classList.add('show');
    }
    
    if(direccion.value == '' || !direccion.value){
        invalidFeedbackDireccion.classList.add('show');
    }

    // si el formulario es válido, realiza la compra

    if( (nombre.value !== '' && nombre.value) && (direccion.value !== '' && direccion.value) ){
        Swal.fire({
            icon: 'warning',
            title: 'Estás a punto de realizar la compra',
            confirmButtonText: 'Continuar',
            showCancelButton: true
        }).then( resultado => {
            if(resultado.isConfirmed) this.realizarCompra(e);
        });
    }
}

function realizarCompra(e){
    e.preventDefault();
   
    // mostrarNotificacion('Compra realizada con éxito', 4000, 'success');
    Swal.fire({
        icon: 'success',
        title: 'Compra exitosa!',
        text: 'La operación se ha realizado con éxito',
        timer: 4000
    });
    vaciarCarrito();
    limpiarFormularioCarrito();
}


/**
 * 
 * @param {*} texto - texto a mostrar
 * @param {*} tiempoMs - duración en ms
 * @param {*} tipo - success, warning
 */
function mostrarNotificacion(texto, tiempoMs, tipo){
    const numero_random = Math.round(Math.random() * 1E9)

    const item = document.createElement("div");
    item.innerHTML = `
    <div id="texto-notificacion-${ numero_random }" ${(tipo == 'success')? 'class="mensaje-wrapper mensaje-wrapper--success"': (tipo == 'warning')? 'class="mensaje-wrapper mensaje-wrapper--warning"': 'class="mensaje-wrapper"'} >
        <div class="mensaje">${ texto }</span></div>
    </div>
    `;

    const notificacionWrapper = document.getElementById("notificacion-wrapper");
    notificacionWrapper.appendChild(item);

    $(`#texto-notificacion-${ numero_random }`).slideDown("fast");

    setTimeout(() => {
        $(`#texto-notificacion-${ numero_random }`).slideUp("fast");
    }, tiempoMs);
}


const obtenerCarritoLocalStorage = () =>
{
    const productosCarrito = JSON.parse(localStorage.getItem('carrito'));

    if(productosCarrito){
        for (const producto of productosCarrito) {
            agregarProducto(producto.id);
        }
    }
}

// obtiene los productos mediante AJAX (Petición GET) y los ordena según recomendación

function obtenerProductosDesdeJson(){

    return new Promise( (resolve, reject) => {
        $.get( "data/productos.json", function( productosResp ) {
            productos = productosResp.sort( (a, b) => {
                if( a.recomendado ){
                    return -1;
                } else{
                    return 1;
                }
            });
        })
            .done( () => {
                console.log('[GET] - Productos obtenidos con éxito');
                return resolve(true);
            })
            .fail( ()=> {
                console.error('Ha ocurrido un error al obtener los productos');
                return reject(false);
            });
        
    });
}



/**
 *  detecta cuando el DOM está listo para usarse
 */

$(document).ready( async () => {
    
    await obtenerProductosDesdeJson();

    mostrarNotificacion('👋Te damos la bienvenida!', 3000);

    // lista en el DOM los productos

    console.log('Se lista los productos en el DOM');
    let timeShow = 0;

    for (const producto of productos) {
        const item = document.createElement("div");

        item.innerHTML = `
        <div class="producto" id="producto${producto.id}">
            <div class="producto-body">
                <div class="producto__imagen-wrapper">
                    <img class="producto__imagen" src="${producto.imagen}" alt="imagen_producto">
                </div>
                <div class="producto-info">
                    <p class="producto__nombre">${producto.nombre}</p>
                    <p class="producto__descripcion">${producto.descripcion}</p>
                </div>
            </div>
            <div class="producto-footer">
                <div>
                    ${(producto.precio_descuento > 0) ? `
                        <span class="producto__precio-descuento">$${producto.precio_descuento}</span>
                        <span class="producto__precio-anterior">$${producto.precio}</span>
                        `: `
                        <span class="producto__precio">$${producto.precio}</span>
                        ` }
                </div>
                <button type="button" onclick="agregarProducto(${ producto.id })" class="producto__btn-add">Añadir</button>
            </div>
        </div>
        `;

        setTimeout(() => {
            console.log('- Producto agregado: ', producto.nombre);
            const sectionProductos = document.getElementById("section-productos");
            sectionProductos.appendChild(item);

            $(`#producto${producto.id}`).fadeIn("slow");
        }, timeShow);

        timeShow += 50;
    }

    // obtiene y carga el carrito almacenado en el localstorage

    obtenerCarritoLocalStorage();

});

/*
    Permite detectar cuando cambia un elemento
*/

$("#form-nombre").change( () => {
    console.log('El input #form-nombre ha cambiado');
    validarCampoNombre();
});

$("#form-direccion").change( () => {
    console.log('El input #form-direccion ha cambiado');
    validarCampoDireccion();
});

/*
    Método submit() JQuery
    se ejecuta cuando se hace "click" en btn "realizar compra"
*/

$("#formulario-carrito").submit( (e) => {
    console.log('Se ha ejecutado el método submit() de JQuery!');
    alertRealizarCompra(e);
    // realizarCompra(e);
});

$("#ir-carrito").click( e => {
    e.preventDefault();
    
    $("#app").animate({
        scrollTop: $("#section-carrito").offset().top
    }, 750);
});