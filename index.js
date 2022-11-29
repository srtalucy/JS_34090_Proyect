document.addEventListener('DOMContentLoaded', () => { //Creo mi array con los productos
    const productos=[
        {
            id:1, nombre:"Young Forever", precio:41.30, imagen:"./images/youngforever.jpg",
        },
        {
            id:2, nombre:"Love Yourself: Answer", precio:41.99, imagen:"./images/loveyourself.jpg",
        },
        {
            id:3, nombre:"Proof", precio:69.17, imagen: "./images/proof.jpg",
        },
        {
            id:4, nombre:"2 Cool 4 Skool/O!RUL8,2?", precio:24.99, imagen:"./images/2cool.jpg"  ,
        },
        {
            id:5, nombre:"BTS, the Best", precio:17.37, imagen:"./images/thebest.jpg" ,
        },
        {
            id:6, nombre:"Map of the Soul: Persona", precio:32.99, imagen:"./images/mapofthesoulpersona.jpg" ,
        },
        {
            id:7, nombre:"Youth", precio:30.99, imagen:"./images/youth.jpg" ,
        },
        {
            id:8, nombre:"Wings", precio:26.99, imagen: "./images/wings.jpg",
        },
        {
            id:9, nombre:"Be", precio:41.30, imagen: "./images/be.jpg",
        },
        {
            id:10, nombre:"Dark & Wild", precio:33.50, imagen:"./images/darkandwild.jpg" ,
        },
        {
            id:11, nombre:"Love Yourself: Her", precio:31.99, imagen:"./images/loveyourselfher.jpg" ,
        },
        {
            id:12, nombre:"Map of the Soul: 7", precio:40.99, imagen:"./images/mapofthesoul7.jpg"  ,
        },
        
    ];
    let carrito=[];
    const moneda="€";
    const DOMitems= document.querySelector("#items");   //Llamo a mis elementos del html
    const DOMcarrito= document.querySelector("#carrito");
    const DOMtotal= document.querySelector("#total");
    const DOMvaciar=document.querySelector("#vaciar");
    const DOMpagar=document.querySelector("#pagar");
    const ls= window.localStorage;
    function crearProductos(){ //Creo todos mis elementos de mi html para cada producto
        productos.forEach((elemento)=>{
            const card=document.createElement("div");
            card.classList.add("card", "col-sm-4");
            const cardBody=document.createElement("div");
            cardBody.classList.add("card-body");
            const cardImagen= document.createElement("img");
            cardImagen.classList.add("img-fluid");
            cardImagen.setAttribute("src", elemento.imagen);
            const cardTitulo= document.createElement("h4");
            cardTitulo.textContent=elemento.nombre;
            const cardPrecio= document.createElement("p");
            cardPrecio.textContent= `${elemento.precio}${moneda}`;
            const cardBoton= document.createElement("button");
            cardBoton.classList.add("btn", "btn-success");
            cardBoton.textContent= "Agregar";
            cardBoton.setAttribute("marcador", elemento.id);
            cardBoton.addEventListener("click", añadirAlCarrito)

            cardBody.appendChild(cardImagen);   //Inserto mis elementos 
            cardBody.appendChild(cardTitulo); 
            cardBody.appendChild(cardPrecio); 
            cardBody.appendChild(cardBoton);
            card.appendChild(cardBody);
            DOMitems.appendChild(card);  
        });
        
    }

    function añadirAlCarrito(evento){ //Function para añadir al carrito con un toastify como notificacion
        carrito.push(evento.target.getAttribute("marcador"))
        actualizarCarrito();
        guardarLocalStorage();
        Toastify({

            text: "El producto se agregó correctamente✨",
            
            duration: 3000,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
              },
            
            }).showToast();
    }
    function actualizarCarrito(){ //Function para mantener actualizado mi carrito a medida que voy agregando o eliminando cosas
        DOMcarrito.textContent="";
        const noDuplicados= [...new Set (carrito)];
        noDuplicados.forEach((item)=>{
            const items= productos.filter(itemProductos=>{
                return itemProductos.id ===parseInt(item);
            });
            const cantidadProductos= carrito.reduce((total, itemId)=>{
                return itemId===item ? total+=1:total;
            },0);
            const li= document.createElement("li"); //Creo mi lista de elementos agregados en el html
            li.classList.add("list-group-item", "text-right","mx-2");
            li.textContent=`${cantidadProductos} x ${items[0].nombre} - ${items[0].precio}${moneda}`;
            const botonBorrar= document.createElement("button");
            botonBorrar.classList.add("btn", "btn-danger", "mx-5");
            botonBorrar.textContent= `Eliminar`;
            botonBorrar.style.marginLeft= "1em";
            botonBorrar.dataset.item=item;
            botonBorrar.addEventListener("click", borrarDelCarrito);
            li.appendChild(botonBorrar);
            DOMcarrito.appendChild(li);
        });
        DOMtotal.textContent = calcularTotal();
    }
    function borrarDelCarrito(evento){ //Function para eliminar cosas de mi carrito
        const id= evento.target.dataset.item;
        carrito=carrito.filter((carritoid)=>{ 
            return carritoid!==id;
        });
        actualizarCarrito();
        guardarLocalStorage();
        Toastify({

            text: "El producto se eliminó correctamente💥",
            
            duration: 3000,
            style: {
                background: "linear-gradient(to right, #fd1d1d, #fcb045)",
              },
            
            }).showToast();
    }

    function calcularTotal(){ //Calculo el precio total
        return carrito.reduce((total, item)=>{
            const items= productos.filter((itemProductos)=>{
                return itemProductos.id===parseInt(item);

            });
            return total+items[0].precio;
        },0).toFixed(2);
    }
    function vaciarCarrito() { //Function para vaciar completamente el carrito
       
        carrito = [];
       
        actualizarCarrito();
        localStorage.clear();
        Toastify({

            text: "Se ha vaciado el carrito",
            
            duration: 3000,
            style: {
                background: "linear-gradient(to left, #ccc8c8, #6c757d)",
              },
            
            }).showToast();

    }
    function guardarLocalStorage(){ //Function para guardar en el local storage
        ls.setItem("carrito", JSON.stringify(carrito));
    }
    function cargarLocalStorage(){
        if (ls.getItem("carrito")!== null){
            carrito=JSON.parse(ls.getItem("carrito"));

        }
    }
   
    DOMvaciar.addEventListener("click", vaciarCarrito); //Eventos de click para los botones de pagar y vaciar
    DOMpagar.addEventListener("click", ()=>{
        Swal.fire({
            title: 'Estás seguro?',
            text: "Procederemos al pago si ustedes acepta",
            showDenyButton: true,
            confirmButtonText: 'Acepto',
            denyButtonText: `Quiero seguir viendo la tienda!`,
          }).then((result) => {
        
            if (result.isConfirmed) {
              Swal.fire('Muchas gracias!', 'Su compra ha sido confirmada', 'success')
            } else if (result.isDenied) {
              Swal.fire('Cool!', 'Esperamos por tu compra :)', 'info')
            }
          })
    });
    cargarLocalStorage(); //Ejecuto las funciones principales
    crearProductos();
    actualizarCarrito();
});
