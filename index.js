const items = document.querySelector("#items");
const itemCarrito = document.querySelector("#item");
const itemFooter= document.querySelector("#footer");
const cards = document.querySelector("#template-card").content;
const templateFooter=document.querySelector("#template-footer").content;
const templateCarrito=document.querySelector("#template-carrito").content;

let carrito={};
const moneda="€";
const fragment = document.createDocumentFragment();
const ls= window.localStorage;




document.addEventListener("DOMContentLoaded", ()=>{
    fetchData();
    if(localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"));
        crearCarrito();
    }
});
items.addEventListener("click", (e)=>{
    btnAoD(e);
})
const fetchData = async()=>{
    try {
        const response = await fetch("productos.json");
        const data = await response.json();
        crearProductos(data);
    } catch (error) {
        console.log(error);
    }
}
items.addEventListener("click", (e)=>{
    addCarrito(e);
})

const crearProductos= data =>{
    data.forEach(producto =>{
        cards.querySelector("h5").textContent = producto.nombre;
        cards.querySelector("p").textContent = producto.precio;
        cards.querySelector("img").setAttribute("src", producto.imagen);
        cards.querySelector(".btn-success").dataset.id=producto.id;
        const clone = cards.cloneNode(true);
        
        fragment.appendChild(clone)
    })
    
    items.appendChild(fragment);
   
}

const addCarrito= e=>{
    if(e.target.classList.contains("btn-success")){
        setCarrito(e.target.parentElement);
        Toastify({

            text: "El producto se agregó correctamente✨",
            
            duration: 3000,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
              },
            
            }).showToast();
    }
   
    e.stopPropagation();
}
const setCarrito = objeto =>{
  
   const producto = {
    id: objeto.querySelector(".btn-success").dataset.id,
    nombre: objeto.querySelector("h5").textContent,
    precio: objeto.querySelector("p").textContent,
    cantidad:1,
   }
   if(carrito.hasOwnProperty(producto.id)){
    producto.cantidad= carrito[producto.id].cantidad+1;
   }
   carrito[producto.id] ={...producto};
   console.log(carrito);
   crearCarrito();
}
const crearCarrito = ()=>{
    itemCarrito.innerHTML="";
    Object.values(carrito).forEach(producto=>{
        templateCarrito.querySelector("th").textContent = producto.id;
        templateCarrito.querySelectorAll("td")[0].textContent = producto.nombre;
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
        templateCarrito.querySelector("span").textContent=(producto.cantidad*producto.precio).toFixed(2);
        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    itemCarrito.appendChild(fragment);
    crearFooterCarrito();
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
const crearFooterCarrito= ()=>{
    itemFooter.innerHTML="";
    if(Object.keys(carrito).length ===0){
        itemFooter.innerHTML=
    `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
    return
    }
    const sumaCant = Object.values(carrito).reduce((acum, {cantidad})=>acum+cantidad ,0);
    const sumaPrecio= Object.values(carrito).reduce((acum, {cantidad, precio})=>(acum+cantidad*precio),0).toFixed(2);
    templateFooter.querySelectorAll("td")[0].textContent = sumaCant;
    templateFooter.querySelector("span").textContent = sumaPrecio;
    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    itemFooter.appendChild(fragment);
    const vaciar = document.getElementById("vaciar-carrito");
    vaciar.addEventListener("click", ()=>{
        Toastify({

            text: "Se ha vaciado el carrito",
            
            duration: 3000,
            style: {
                background: "linear-gradient(to left, #ccc8c8, #6c757d)",
              },
            
            }).showToast();
            carrito ={};
        
        crearCarrito();
        
    });
    const pagar = document.querySelector("#pagar");
    pagar.addEventListener("click", ()=>{
        
            Swal.fire({
                title: 'Estás seguro?',
                text: "Procederemos al pago si ustedes acepta",
                showDenyButton: true,
                confirmButtonText: 'Acepto',
                denyButtonText: `Quiero seguir viendo la tienda!`,
              }).then((result) => {
            
                if (result.isConfirmed) {
                  Swal.fire('Muchas gracias!', 'Su compra ha sido confirmada', 'success');
                    carrito = {};
                    localStorage.clear();
                    crearCarrito();
                } else if (result.isDenied) {
                  Swal.fire('Cool!', 'Esperamos por tu compra :)', 'info')
                }
              })
    })
}
const btnAoD = e =>{
    console.log(e.target);
    if(e.target.classList.contains("btn-info")){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++
        carrito[e.target.dataset.id] ={...producto};
        crearCarrito();
    }
    if(e.target.classList.contains("btn-danger")){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad = carrito[e.target.dataset.id].cantidad - 1;
        carrito[e.target.dataset.id]={...producto};
       
        if(producto.cantidad===0){
            delete carrito[e.target.dataset.id];
       
        }
        crearCarrito();
        
    }
    e.stopPropagation();
}







