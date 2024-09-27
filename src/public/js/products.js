const socket = io()

// Manejo de conexión con el servidor
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('products', (data) => {
    //console.log(data);
    const containerProducts = document.getElementById('container')
    containerProducts.innerHTML = ``
    data.forEach(e => {
        const card = document.createElement('div')
        card.innerHTML = `<p>${e._id}</p>
                                    <p>${e.title}</p>
                                    <p>${e.description}</p>
                                    <p>${e.code}</p>
                                    <p>$${e.price}</p>
                                    <p>${e.category}</p>
                                    <p>${e.status}</p>
                                    <p>${e.stock}<</p>
                                    <p>
                                      <img style="height: 18px;" src="${e.thumbnail}" alt="${e.title}">
                                    </p>
                                      <button type="button" class="btn btn-danger btn-sm btnBuy" data-id="${e._id}">Agregar al Carrito</button>
                              `
        containerProducts.appendChild(card)

        // Adjuntar eventos a los botones de comprar
        // document.querySelectorAll('.btnBuy').forEach(button => {
        //     button.addEventListener('click', (event) => {
        //         event.preventDefault()
        //         const id = button.getAttribute('data-id');
        //         alert(`Producto ${id} agregado al Carrito`);
        //     });
        // });
    });
    
})